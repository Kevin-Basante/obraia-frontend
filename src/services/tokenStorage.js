// The access token lives only in memory: it disappears when the tab closes
// and expires in 15 minutes. The refresh token is kept in localStorage so
// the session survives a page reload; the backend rotates it on every use.
const REFRESH_TOKEN_KEY = 'obraia.refreshToken'

let accessToken = null

export function getAccessToken() {
  return accessToken
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    // Storage can be blocked (private mode): the session then lasts until reload.
    return null
  }
}

export function saveTokens({ accessToken: newAccessToken, refreshToken }) {
  accessToken = newAccessToken
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  } catch {
    // Ignored: see getRefreshToken.
  }
}

export function clearTokens() {
  accessToken = null
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {
    // Ignored: see getRefreshToken.
  }
}
