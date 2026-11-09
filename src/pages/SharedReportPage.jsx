import { useSearchParams } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { useLanguage } from '../hooks/useLanguage.js'
import { downloadSharedReport } from '../services/reportService.js'
import { reportFileName, saveFile } from '../utils/report.js'
import { t } from '../i18n/i18n.js'

/** Opened from a shared link: anyone, even without an account, downloads the public report. */
export function SharedReportPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { language } = useLanguage()
  const downloading = useFormSubmit(async () => {
    saveFile(await downloadSharedReport(token, language), reportFileName('ObraIA', 'public'))
  })

  return (
    <AuthCard title={t('sharedReportPage.title')} description={t('sharedReportPage.description')}>
      {!token && <FormAlert>{t('sharedReportPage.incompleteLink')}</FormAlert>}
      <FormAlert>{downloading.error?.message}</FormAlert>
      {token && (
        <div className="button-row">
          <button type="button" disabled={downloading.pending} onClick={() => downloading.submit()}>
            {downloading.pending ? t('sharedReportPage.preparing') : t('sharedReportPage.download')}
          </button>
        </div>
      )}
      <p className="muted">{t('sharedReportPage.note')}</p>
    </AuthCard>
  )
}
