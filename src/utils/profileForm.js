// Same rules as the backend for the profile. The phone is optional.

const PHONE_PATTERN = /^[+0-9 ()-]{7,20}$/
const MAX_NAME = 100

export function toProfileForm(user) {
  return { firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' }
}

function nameError(value, emptyMessage) {
  const name = value.trim()
  if (!name) return emptyMessage
  if (name.length > MAX_NAME) return `Use up to ${MAX_NAME} characters`
  return null
}

/** Returns an object with one message per invalid field (empty if all are valid). */
export function validateProfile({ firstName, lastName, phone }) {
  const errors = {}
  const first = nameError(firstName, 'Enter your first name')
  if (first) errors.firstName = first
  const last = nameError(lastName, 'Enter your last name')
  if (last) errors.lastName = last
  if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) errors.phone = 'Enter a valid phone number'
  return errors
}

/** Body for the backend. An empty phone removes the saved one. */
export function toProfileRequest({ firstName, lastName, phone }) {
  return { firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() }
}
