import { t } from '../i18n/i18n.js'
// Same limits as the backend for a blueprint, checked before uploading it.

export const MAX_FILE_BYTES = 10 * 1024 * 1024
export const MAX_BLUEPRINTS = 10

// What the file picker offers. The backend checks the real type by the first bytes.
export const ACCEPTED_FILES = '.pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp'

const ACCEPTED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'webp']

/** Returns the problem of the file, or null if it can be uploaded. */
export function validateBlueprintFile(file) {
  if (!file) return t('blueprintFile.chooseAPdfOrAn')
  const extension = file.name.split('.').pop().toLowerCase()
  if (!ACCEPTED_EXTENSIONS.includes(extension)) return t('blueprintFile.uploadAPdfOrAnImage')
  if (file.size === 0) return t('blueprintFile.theFileIsEmpty')
  if (file.size > MAX_FILE_BYTES) return t('blueprintFile.theFileIsTooLarge')
  return null
}

/** Images are shown with <img>; PDFs need the viewer of the browser. */
export function isImage(blueprint) {
  return blueprint.fileType === 'image'
}
