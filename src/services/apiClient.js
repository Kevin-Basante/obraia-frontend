import { API_URL } from '../config/env.js'

/**
 * Error with the code and message sent by the backend:
 * { error: { code, message, fields? } }. `fields` has the message of each
 * invalid field when the backend answers VALIDATION_ERROR.
 */
export class ApiError extends Error {
  constructor(message, { status = null, code = 'UNKNOWN_ERROR', fields = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

/**
 * Sends a request to the backend and returns the JSON body (or null when
 * the answer has no body, like 204). Throws ApiError if the request fails.
 * A FormData body is sent as it is (the browser sets the multipart header),
 * and `responseType: 'blob'` returns the bytes of a file instead of JSON.
 */
export async function apiRequest(path, { method = 'GET', body, token, signal, responseType = 'json' } = {}) {
  const isForm = body instanceof FormData
  const headers = { Accept: 'application/json' }
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined || isForm ? body : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Could not connect to the server', { code: 'NETWORK_ERROR' })
  }

  if (response.ok && responseType === 'blob') return response.blob()

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(data?.error?.message ?? `The server responded with status ${response.status}`, {
      status: response.status,
      code: data?.error?.code ?? 'HTTP_ERROR',
      fields: data?.error?.fields ?? null,
    })
  }

  return data
}

/** Sends a GET request to the backend and returns the JSON body. */
export function apiGet(path, options) {
  return apiRequest(path, { ...options, method: 'GET' })
}

/** Sends a POST request with a JSON body. */
export function apiPost(path, body, options) {
  return apiRequest(path, { ...options, method: 'POST', body })
}
