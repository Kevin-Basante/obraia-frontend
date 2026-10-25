// Same rules as the backend for a site manager. Document and phone are optional.

const DOCUMENT_PATTERN = /^[0-9A-Za-z.-]{5,20}$/
const PHONE_PATTERN = /^[+0-9 ()-]{7,20}$/

export const EMPTY_SITE_MANAGER_FORM = { fullName: '', documentNumber: '', phone: '' }

export function validateSiteManager({ fullName, documentNumber, phone }) {
  const errors = {}
  const name = fullName.trim()
  if (name.length < 3 || name.length > 150) errors.fullName = 'Use 3 to 150 characters'
  if (documentNumber.trim() && !DOCUMENT_PATTERN.test(documentNumber.trim())) {
    errors.documentNumber = 'Use 5 to 20 letters, numbers, dots or dashes'
  }
  if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) errors.phone = 'Enter a valid phone number'
  return errors
}

/** Body for the backend: trimmed text, and null for the empty optional fields. */
export function toSiteManagerRequest({ fullName, documentNumber, phone }) {
  return {
    fullName: fullName.trim(),
    documentNumber: documentNumber.trim() || null,
    phone: phone.trim() || null,
  }
}

export function toSiteManagerForm(manager) {
  return {
    fullName: manager.fullName,
    documentNumber: manager.documentNumber ?? '',
    phone: manager.phone ?? '',
  }
}
