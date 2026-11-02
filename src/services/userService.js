import { authorizedRequest } from './session.js'

/** Profile of the signed-in user. */
export function getCurrentUser(options) {
  return authorizedRequest('/api/users/me', options)
}

/** Saves the name and the phone: { firstName, lastName, phone }. Returns the updated profile. */
export function updateProfile(profile) {
  return authorizedRequest('/api/users/me', { method: 'PUT', body: profile })
}
