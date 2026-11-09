import { useCallback, useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { useLanguage } from '../../hooks/useLanguage.js'
import {
  downloadReport,
  getFullReportAccess,
  requestFullReport,
  shareReport,
} from '../../services/reportService.js'
import { formatDateTime } from '../../utils/format.js'
import { fullReportAction, fullReportText, reportFileName, saveFile } from '../../utils/report.js'
import { serverMessage } from '../../utils/serverMessage.js'
import './ReportPanel.css'
import { t } from '../../i18n/i18n.js'

/**
 * Buttons to download the analyses of the project as PDF. The public report
 * (progress, phases and tasks) is for every member and can be shared with a
 * link. The full report adds money and risk: the creator downloads it at
 * once; anyone else asks for it and the creator approves it by email.
 */
export function ReportPanel({ projectId, projectName }) {
  const { language } = useLanguage()
  const access = useApiData((signal) => getFullReportAccess(projectId, { signal }), [projectId])
  const { retry: retryAccess } = access
  const [link, setLink] = useState(null)
  const [notice, setNotice] = useState(null)

  const download = useCallback(
    async (type) => {
      setNotice(null)
      const file = await downloadReport(projectId, type, language)
      saveFile(file, reportFileName(projectName, type))
    },
    [projectId, projectName, language],
  )
  const downloading = useFormSubmit(download)

  const share = useCallback(async () => {
    const created = await shareReport(projectId)
    setLink(created)
    // Copying can fail (for example, without HTTPS); the link stays on screen to copy by hand.
    const copied = await navigator.clipboard?.writeText(created.url).then(
      () => true,
      () => false,
    )
    setNotice(copied ? t('reportPanel.share.copied') : null)
  }, [projectId])
  const sharing = useFormSubmit(share)

  const ask = useCallback(async () => {
    const response = await requestFullReport(projectId)
    setNotice(serverMessage(response))
    retryAccess()
  }, [projectId, retryAccess])
  const asking = useFormSubmit(ask)

  const action = fullReportAction(access.data)
  const error = downloading.error ?? sharing.error ?? asking.error

  return (
    <section className="card report-panel" aria-live="polite">
      <div className="report-panel__header">
        <h2>{t('reportPanel.title')}</h2>
        <p className="muted">{t('reportPanel.description')}</p>
      </div>
      <div className="report-panel__options">
        <article className="report-panel__option">
          <h3>{t('reportPanel.public.title')}</h3>
          <p className="muted">{t('reportPanel.public.text')}</p>
          <div className="button-row">
            <button type="button" disabled={downloading.pending} onClick={() => downloading.submit('public')}>
              {t('reportPanel.public.download')}
            </button>
            <button
              type="button"
              className="button-secondary"
              disabled={sharing.pending}
              onClick={() => sharing.submit()}
            >
              {sharing.pending ? t('reportPanel.share.creating') : t('reportPanel.share.button')}
            </button>
          </div>
          {link && (
            <p className="report-panel__link">
              <input type="text" readOnly value={link.url} aria-label={t('reportPanel.share.label')} />
              <small className="muted">
                {t('reportPanel.share.expires', { date: formatDateTime(link.expiresAt) })}
              </small>
            </p>
          )}
        </article>
        <article className="report-panel__option">
          <h3>{t('reportPanel.full.title')}</h3>
          <p className="muted">{t('reportPanel.full.text')}</p>
          {access.status === 'error' && <FormAlert>{access.error.message}</FormAlert>}
          {access.data && <p className="report-panel__status">{fullReportText(access.data)}</p>}
          <div className="button-row">
            {action === 'download' && (
              <button type="button" disabled={downloading.pending} onClick={() => downloading.submit('full')}>
                {t('reportPanel.full.download')}
              </button>
            )}
            {action === 'ask' && (
              <button type="button" className="button-secondary" disabled={asking.pending} onClick={() => asking.submit()}>
                {asking.pending ? t('reportPanel.full.asking') : t('reportPanel.full.ask')}
              </button>
            )}
          </div>
        </article>
      </div>
      {downloading.pending && <p className="muted">{t('reportPanel.preparing')}</p>}
      {notice && <FormAlert type="success">{notice}</FormAlert>}
      <FormAlert>{error?.message}</FormAlert>
    </section>
  )
}
