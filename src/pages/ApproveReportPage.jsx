import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { approveReport } from '../services/reportService.js'
import { serverMessage } from '../utils/serverMessage.js'
import { t } from '../i18n/i18n.js'

/**
 * Opened from the email sent to the creator of a project. The approval
 * waits for the button, so a mail program that opens links by itself does
 * not approve anything.
 */
export function ApproveReportPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState(null)
  const approving = useFormSubmit(async () => setMessage(serverMessage(await approveReport(token))))

  if (message) {
    return (
      <AuthCard title={t('approveReportPage.approved')} description={message}>
        <Link to="/projects" className="button-link">
          {t('approveReportPage.goToMyProjects')}
        </Link>
      </AuthCard>
    )
  }

  if (!token) {
    return (
      <AuthCard title={t('approveReportPage.title')}>
        <FormAlert>{t('approveReportPage.incompleteLink')}</FormAlert>
      </AuthCard>
    )
  }

  return (
    <AuthCard title={t('approveReportPage.title')} description={t('approveReportPage.description')}>
      <FormAlert>{approving.error?.message}</FormAlert>
      <div className="button-row">
        <button type="button" disabled={approving.pending} onClick={() => approving.submit()}>
          {approving.pending ? t('approveReportPage.approving') : t('approveReportPage.approve')}
        </button>
      </div>
      <p className="muted">{t('approveReportPage.ignore')}</p>
    </AuthCard>
  )
}
