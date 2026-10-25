import { apiPost } from './apiClient.js'

// One function per authentication endpoint of the backend (/api/auth/...).

export function register({ firstName, lastName, email, password, phone }) {
  return apiPost('/api/auth/register', { firstName, lastName, email, password, phone: phone || null })
}

export function verifyEmail(token) {
  return apiPost('/api/auth/verify-email', { token })
}

export function resendVerification(email) {
  return apiPost('/api/auth/resend-verification', { email })
}

/** Returns { accessToken, refreshToken, expiresIn, user }. */
export function login(email, password) {
  return apiPost('/api/auth/login', { email, password })
}

/** Returns new tokens; the refresh token sent here stops working. */
export function refresh(refreshToken) {
  return apiPost('/api/auth/refresh', { refreshToken })
}

export function logout(refreshToken) {
  return apiPost('/api/auth/logout', { refreshToken })
}

export function forgotPassword(email) {
  return apiPost('/api/auth/forgot-password', { email })
}

export function resetPassword(token, newPassword) {
  return apiPost('/api/auth/reset-password', { token, newPassword })
}
