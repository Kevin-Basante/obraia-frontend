import { authorizedRequest } from './session.js'

// Blueprints of a project (/api/projects/{id}/blueprints): photos or PDFs.

function blueprintsPath(projectId, suffix = '') {
  return `/api/projects/${encodeURIComponent(projectId)}/blueprints${suffix}`
}

export function listBlueprints(projectId, options) {
  return authorizedRequest(blueprintsPath(projectId), options)
}

/** Sends the file as multipart/form-data in the part "file". */
export function uploadBlueprint(projectId, file) {
  const body = new FormData()
  body.append('file', file)
  return authorizedRequest(blueprintsPath(projectId), { method: 'POST', body })
}
