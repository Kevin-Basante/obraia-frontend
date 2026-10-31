import { authorizedRequest } from './session.js'

// Tasks of the phases and their progress reports (/api/projects/{id}/tasks).

function tasksPath(projectId, suffix = '') {
  return `/api/projects/${encodeURIComponent(projectId)}/tasks${suffix}`
}

function taskPath(projectId, taskId, suffix = '') {
  return tasksPath(projectId, `/${encodeURIComponent(taskId)}${suffix}`)
}

export function createTask(projectId, task) {
  return authorizedRequest(tasksPath(projectId), { method: 'POST', body: task })
}

/** Another phaseId moves the task to that phase. */
export function updateTask(projectId, taskId, task) {
  return authorizedRequest(taskPath(projectId, taskId), { method: 'PUT', body: task })
}

export function deleteTask(projectId, taskId) {
  return authorizedRequest(taskPath(projectId, taskId), { method: 'DELETE' })
}

export function changeTaskStatus(projectId, taskId, status) {
  return authorizedRequest(taskPath(projectId, taskId, '/status'), { method: 'PATCH', body: { status } })
}

/** Progress reports of a task, newest first. */
export function listProgressReports(projectId, taskId, options) {
  return authorizedRequest(taskPath(projectId, taskId, '/progress'), options)
}

export function reportProgress(projectId, taskId, report) {
  return authorizedRequest(taskPath(projectId, taskId, '/progress'), { method: 'POST', body: report })
}
