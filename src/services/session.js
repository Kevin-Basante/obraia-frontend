import { apiRequest } from './apiClient.js'
import { refresh } from './authService.js'
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenStorage.js'

// Several requests can find an expired token at the same time: they all
// wait for the same refresh instead of each spending the refresh token.
let refreshInProgress = null

/**
 * Gets a new access token with the saved refresh token. Returns the user,
 * or null if there is no session (or it expired).
 */
export function refreshSession() {
  if (!refreshInProgress) {
    refreshInProgress = doRefresh().finally(() => {
      refreshInProgress = null
    })
  }
  return refreshInProgress
}

async function doRefresh() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null
  try {
    const session = await refresh(refreshToken)
    saveTokens(session)
    return session.user
  } catch (error) {
    // Only a rejected token ends the session; a network error keeps it for later.
    if (error.status === 401 || error.status === 403) clearTokens()
    throw error
  }
}

/**
 * Request to a protected route. If the access token expired, it refreshes
 * the session once and repeats the request.
 */
export async function authorizedRequest(path, options = {}) {
  try {
    return await apiRequest(path, { ...options, token: getAccessToken() })
  } catch (error) {
    if (error.status !== 401) throw error
    const user = await refreshSession()
    if (!user) throw error
    return apiRequest(path, { ...options, token: getAccessToken() })
  }
}
