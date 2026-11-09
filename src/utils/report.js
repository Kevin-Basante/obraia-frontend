import { formatDateTime } from './format.js'
import { t } from '../i18n/i18n.js'

/** "Casa Basante" -> "casa-basante", without accents or symbols, for the name of a file. */
export function slug(text) {
  const plain = String(text ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return plain || 'project'
}

/** "casa-basante-informe-publico.pdf" in Spanish or "casa-basante-public-report.pdf" in English. */
export function reportFileName(projectName, type) {
  return `${slug(projectName)}-${t(`reportPanel.fileName.${type}`)}.pdf`
}

/** Saves a Blob as a file with the given name, through a link the browser clicks. */
export function saveFile(blob, fileName, doc = document) {
  const url = URL.createObjectURL(blob)
  const link = doc.createElement('a')
  link.href = url
  link.download = fileName
  doc.body.appendChild(link)
  link.click()
  link.remove()
  // The browser starts the download on the click; the address is freed a bit later.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * What the user can do with the full report, from the answer of the backend:
 * "download" (creator or approved), "wait" (asked, waiting for the creator) or "ask".
 */
export function fullReportAction(access) {
  if (!access) return null
  if (access.status === 'owner' || access.status === 'approved') return 'download'
  if (access.status === 'pending') return 'wait'
  return 'ask'
}

/** One sentence about where the request of the full report stands. */
export function fullReportText(access) {
  switch (access?.status) {
    case 'owner':
      return t('reportPanel.full.owner')
    case 'approved':
      return t('reportPanel.full.approved', { date: formatDateTime(access.downloadUntil) })
    case 'pending':
      return t('reportPanel.full.pending', { date: formatDateTime(access.requestedAt) })
    case 'expired':
      return t('reportPanel.full.expired')
    default:
      return t('reportPanel.full.none')
  }
}
