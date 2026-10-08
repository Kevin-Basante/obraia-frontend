import { apiGet } from './apiClient.js'

/** "Hello world" with data read from the database. */
export function getHello(options) {
  return apiGet('/api/hello', options)
}

/** Server and database status. */
export function getHealth(options) {
  return apiGet('/api/health', options)
}
