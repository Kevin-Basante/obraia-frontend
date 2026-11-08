import { t } from '../i18n/i18n.js'
// Same rules as the backend, checked before sending the form so the user
// sees the problem at once. The backend validates again anyway.

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const PHONE_PATTERN = /^[+0-9 ()-]{7,20}$/

/** Rules of a password, shown under the field. */
export function passwordHint() {
  return t('validation.atLeast8CharactersWith')
}

export function validateEmail(email) {
  if (!email.trim()) return t('validation.enterYourEmail')
  if (!EMAIL_PATTERN.test(email.trim())) return t('validation.enterAValidEmail')
  return null
}

export function validatePassword(password) {
  if (password.length < 8 || password.length > 72) return t('validation.use8To72Characters')
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return t('validation.includeALetterAndANumber')
  return null
}

/** Returns an object with one message per invalid field (empty if all are valid). */
export function validateRegistration({ firstName, lastName, email, password, confirmPassword, phone }) {
  const errors = {}
  if (!firstName.trim()) errors.firstName = t('validation.enterYourFirstName')
  if (!lastName.trim()) errors.lastName = t('validation.enterYourLastName')
  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError
  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError
  if (confirmPassword !== password) errors.confirmPassword = t('validation.thePasswordsDoNotMatch')
  if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) errors.phone = t('validation.enterAValidPhone')
  return errors
}

/** Rules for changing the password while signed in. The new one must be different. */
export function validatePasswordChange({ currentPassword, newPassword, confirmPassword }) {
  const errors = {}
  if (!currentPassword) errors.currentPassword = t('validation.enterYourCurrentPassword')
  const passwordError = validatePassword(newPassword)
  if (passwordError) errors.newPassword = passwordError
  else if (newPassword === currentPassword) errors.newPassword = t('validation.useAPasswordDifferentFrom')
  if (confirmPassword !== newPassword) errors.confirmPassword = t('validation.thePasswordsDoNotMatch')
  return errors
}

/** Rules for the "choose a new password" form. */
export function validateNewPassword({ password, confirmPassword }) {
  const errors = {}
  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError
  if (confirmPassword !== password) errors.confirmPassword = t('validation.thePasswordsDoNotMatch')
  return errors
}
