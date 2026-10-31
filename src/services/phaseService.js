import { authorizedRequest } from './session.js'

// Work plan of a project: its phases, each one with its tasks (/api/projects/{id}/phases).

function phasesPath(projectId, suffix = '') {
  return `/api/projects/${encodeURIComponent(projectId)}/phases${suffix}`
}

/** Phases with their tasks and progress. The list is empty until the plan is created. */
export function getWorkPlan(projectId, options) {
  return authorizedRequest(phasesPath(projectId), options)
}

/** Phases the plan would have, without saving them. */
export function getPlanPreview(projectId, options) {
  return authorizedRequest(phasesPath(projectId, '/preview'), options)
}

/** Creates the plan from the standard phases of the project type. */
export function generatePlan(projectId) {
  return authorizedRequest(phasesPath(projectId, '/generate'), { method: 'POST' })
}

/** Deletes the plan; the backend refuses it once a task has progress. */
export function deletePlan(projectId) {
  return authorizedRequest(phasesPath(projectId), { method: 'DELETE' })
}

export function updatePhase(projectId, phaseId, phase) {
  return authorizedRequest(phasesPath(projectId, `/${encodeURIComponent(phaseId)}`), { method: 'PUT', body: phase })
}

export function changePhaseStatus(projectId, phaseId, status) {
  return authorizedRequest(phasesPath(projectId, `/${encodeURIComponent(phaseId)}/status`), {
    method: 'PATCH',
    body: { status },
  })
}
