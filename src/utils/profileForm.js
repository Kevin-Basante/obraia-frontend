import { t } from '../i18n/i18n.js'
// Same rules as the backend for the profile. The phone is optional.

const PHONE_PATTERN = /^[+0-9 ()-]{7,20}$/
const MAX_NAME = 100

export function toProfileForm(user) {
  return { firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' }
}

function nameError(value, emptyMessage) {
  const name = value.trim()
  if (!name) return emptyMessage
  if (name.length > MAX_NAME) return t('profileForm.useUpTo', { max: MAX_NAME })
  return null
}

/** Returns an object with one message per invalid field (empty if all are valid). */
export function validateProfile({ firstName, lastName, phone }) {
  const errors = {}
  const first = nameError(firstName, t('profileForm.enterYourFirstName'))
  if (first) errors.firstName = first
  const last = nameError(lastName, t('profileForm.enterYourLastName'))
  if (last) errors.lastName = last
  if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) errors.phone = t('validation.enterAValidPhone')
  return errors
}

/** Body for the backend. An empty phone removes the saved one. */
export function toProfileRequest({ firstName, lastName, phone }) {
  return { firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() }
}
