import { authorizedRequest } from './session.js'

/** Profile of the signed-in user. */
export function getCurrentUser(options) {
  return authorizedRequest('/api/users/me', options)
}
