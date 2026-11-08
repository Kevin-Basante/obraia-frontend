import { useCallback, useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { FormField } from '../FormField.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { addMember, listMembers, removeMember } from '../../services/memberService.js'
import { validateEmail } from '../../utils/validation.js'
import './MembersPanel.css'
import { t } from '../../i18n/i18n.js'

/** People who manage the project. Any member can add others by email; the creator always stays. */
export function MembersPanel({ projectId, currentUserId }) {
  const [email, setEmail] = useState('')
  const members = useApiData((signal) => listMembers(projectId, { signal }), [projectId])
  const { retry } = members

  const add = useCallback(
    async (value) => {
      const member = await addMember(projectId, value)
      retry()
      return member
    },
    [projectId, retry],
  )
  const adding = useFormSubmit(add)
  const remove = useCallback((userId) => removeMember(projectId, userId).then(retry), [projectId, retry])
  const removing = useFormSubmit(remove)

  async function handleAdd(event) {
    event.preventDefault()
    const problem = validateEmail(email)
    if (problem) {
      adding.setFieldErrors({ email: problem })
      return
    }
    const member = await adding.submit(email.trim())
    if (member) setEmail('')
  }

  function handleRemove(member) {
    if (window.confirm(t('membersPanel.confirmRemove', { name: `${member.firstName} ${member.lastName}` })))
      removing.submit(member.userId)
  }

  return (
    <section className="card">
      <h2>{t('membersPanel.members')}</h2>
      <p className="muted">{t('membersPanel.membersCanSeeAndManage')}</p>
      <FormAlert>{members.error?.message}</FormAlert>
      {members.data && (
        <ul className="member-list">
          {members.data.map((member) => (
            <li key={member.userId}>
              <span>
                <strong>
                  {member.firstName} {member.lastName}
                </strong>
                {member.userId === currentUserId && t('membersPanel.you')}
                <span className="muted"> · {member.email}</span>
              </span>
              {member.creator ? (
                <span className="muted">{t('membersPanel.creator')}</span>
              ) : (
                <button
                  type="button"
                  className="button-secondary"
                  disabled={removing.pending}
                  onClick={() => handleRemove(member)}
                >
                  {t('membersPanel.remove')}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <form className="inline-form" onSubmit={handleAdd} noValidate>
        <FormField
          label={t('membersPanel.addAMemberByEmail')}
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={adding.fieldErrors.email}
        />
        <button type="submit" disabled={adding.pending}>
          {t('membersPanel.add')}
        </button>
      </form>
      <FormAlert>{(adding.error ?? removing.error)?.message}</FormAlert>
    </section>
  )
}
