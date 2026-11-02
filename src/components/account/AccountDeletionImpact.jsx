import { joinNames, joinedProjectsText } from '../../utils/accountDeletion.js'
import { formatDate } from '../../utils/format.js'
import '../projects/DeletionImpact.css'

/** Warnings shown before deleting the account (red border): the projects it takes with it. */
export function AccountDeletionImpact({ impact }) {
  const { ownProjects, sharedProjects, joinedProjects } = impact
  const joined = joinedProjectsText(joinedProjects)

  return (
    <section className="card deletion-impact" role="alert">
      <h2>Before you delete your account</h2>
      <ul>
        <li>You will not be able to sign in with this account again.</li>
        <li>
          {ownProjects.length > 0
            ? `The projects you created are deleted too: ${joinNames(ownProjects)}.`
            : 'You have not created any project.'}
        </li>
        {sharedProjects.length > 0 && <li>Other members lose access to {joinNames(sharedProjects)}.</li>}
        {joined && <li>{joined}</li>}
        <li>
          We will email you a link that works for {impact.linkValidMinutes} minutes. Nothing is deleted until you open
          it.
        </li>
        <li>After you confirm, your data is removed for good on {formatDate(impact.purgeDate)}.</li>
      </ul>
    </section>
  )
}
