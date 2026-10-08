import { API_URL } from '../config/env.js'

/** Error with the code and message sent by the backend ({ error: { code, message } }). */
export class ApiError extends Error {
  constructor(message, { status = null, code = 'UNKNOWN_ERROR' } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/** Sends a GET request to the backend and returns the JSON body. */
export async function apiGet(path, { signal } = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Could not connect to the server', { code: 'NETWORK_ERROR' })
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(body?.error?.message ?? `The server responded with status ${response.status}`, {
      status: response.status,
      code: body?.error?.code ?? 'HTTP_ERROR',
    })
  }

  return body
}
