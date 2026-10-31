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

/** The bytes of the blueprint as a Blob, to show or save it. */
export function getBlueprintFile(projectId, blueprintId, options) {
  return authorizedRequest(blueprintsPath(projectId, `/${encodeURIComponent(blueprintId)}/file`), {
    ...options,
    responseType: 'blob',
  })
}

export function deleteBlueprint(projectId, blueprintId) {
  return authorizedRequest(blueprintsPath(projectId, `/${encodeURIComponent(blueprintId)}`), { method: 'DELETE' })
}

/**
 * Asks the backend to read the blueprint with the AI. It saves the
 * measurements it finds and answers them. The first call can take about a
 * minute while the AI service wakes up.
 */
export function analyzeBlueprint(projectId, blueprintId) {
  return authorizedRequest(blueprintsPath(projectId, `/${encodeURIComponent(blueprintId)}/analyze`), {
    method: 'POST',
  })
}
