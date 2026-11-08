import { API_URL } from '../config/env.js'
import { hasText, t } from '../i18n/i18n.js'

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
 * Message of an error in the current language, from its code and the values
 * the backend sends in `params`. Unknown codes keep the message of the backend.
 */
export function errorText(code, params, fallback) {
  return hasText(`errors.${code}`) ? t(`errors.${code}`, params) : fallback
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
    throw new ApiError(t('errors.NETWORK_ERROR'), { code: 'NETWORK_ERROR' })
  }

  if (response.ok && responseType === 'blob') return response.blob()

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const code = data?.error?.code ?? 'HTTP_ERROR'
    const params = { status: response.status, ...data?.error?.params }
    throw new ApiError(errorText(code, params, data?.error?.message ?? t('errors.HTTP_ERROR', params)), {
      status: response.status,
      code,
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
