import { authorizedRequest } from './session.js'

// Site managers that each user saves to assign them to projects (/api/site-managers).

function siteManagerPath(id) {
  return `/api/site-managers/${encodeURIComponent(id)}`
}

export function listSiteManagers(options) {
  return authorizedRequest('/api/site-managers', options)
}

export function createSiteManager(siteManager) {
  return authorizedRequest('/api/site-managers', { method: 'POST', body: siteManager })
}

export function updateSiteManager(id, siteManager) {
  return authorizedRequest(siteManagerPath(id), { method: 'PUT', body: siteManager })
}

/** Its projects are left without a site manager. */
export function deleteSiteManager(id) {
  return authorizedRequest(siteManagerPath(id), { method: 'DELETE' })
}
