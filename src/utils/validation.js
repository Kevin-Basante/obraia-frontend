// Same rules as the backend, checked before sending the form so the user
// sees the problem at once. The backend validates again anyway.

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const PHONE_PATTERN = /^[+0-9 ()-]{7,20}$/

export const PASSWORD_HINT = 'At least 8 characters, with one letter and one number.'

export function validateEmail(email) {
  if (!email.trim()) return 'Enter your email'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email'
  return null
}

export function validatePassword(password) {
  if (password.length < 8 || password.length > 72) return 'Use 8 to 72 characters'
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Include at least one letter and one number'
  return null
}

/** Returns an object with one message per invalid field (empty if all are valid). */
export function validateRegistration({ firstName, lastName, email, password, confirmPassword, phone }) {
  const errors = {}
  if (!firstName.trim()) errors.firstName = 'Enter your first name'
  if (!lastName.trim()) errors.lastName = 'Enter your last name'
  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError
  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError
  if (confirmPassword !== password) errors.confirmPassword = 'The passwords do not match'
  if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) errors.phone = 'Enter a valid phone number'
  return errors
}

/** Rules for the "choose a new password" form. */
export function validateNewPassword({ password, confirmPassword }) {
  const errors = {}
  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError
  if (confirmPassword !== password) errors.confirmPassword = 'The passwords do not match'
  return errors
}
