import { joinNames, joinedProjectsText } from '../../utils/accountDeletion.js'
import { formatDate } from '../../utils/format.js'
import '../projects/DeletionImpact.css'
import { t } from '../../i18n/i18n.js'

/** Warnings shown before deleting the account (red border): the projects it takes with it. */
export function AccountDeletionImpact({ impact }) {
  const { ownProjects, sharedProjects, joinedProjects } = impact
  const joined = joinedProjectsText(joinedProjects)

  return (
    <section className="card deletion-impact" role="alert">
      <h2>{t('accountDeletionImpact.beforeYouDeleteYourAccount')}</h2>
      <ul>
        <li>{t('accountDeletionImpact.youWillNotBeAble')}</li>
        <li>
          {ownProjects.length > 0
            ? t('accountDeletionImpact.ownProjects', { names: joinNames(ownProjects) })
            : t('accountDeletionImpact.youHaveNotCreatedAny')}
        </li>
        {sharedProjects.length > 0 && (
          <li>{t('accountDeletionImpact.shared', { names: joinNames(sharedProjects) })}</li>
        )}
        {joined && <li>{joined}</li>}
        <li>{t('accountDeletionImpact.link', { minutes: impact.linkValidMinutes })}</li>
        <li>{t('accountDeletionImpact.purge', { date: formatDate(impact.purgeDate) })}</li>
      </ul>
    </section>
  )
}
