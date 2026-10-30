// Same limits as the backend for a blueprint, checked before uploading it.

export const MAX_FILE_BYTES = 10 * 1024 * 1024
export const MAX_BLUEPRINTS = 10

// What the file picker offers. The backend checks the real type by the first bytes.
export const ACCEPTED_FILES = '.pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp'

const ACCEPTED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'webp']

/** Returns the problem of the file, or null if it can be uploaded. */
export function validateBlueprintFile(file) {
  if (!file) return 'Choose a PDF or an image'
  const extension = file.name.split('.').pop().toLowerCase()
  if (!ACCEPTED_EXTENSIONS.includes(extension)) return 'Upload a PDF or an image (PNG, JPG or WEBP)'
  if (file.size === 0) return 'The file is empty'
  if (file.size > MAX_FILE_BYTES) return 'The file is too large. The limit is 10 MB'
  return null
}

/** Images are shown with <img>; PDFs need the viewer of the browser. */
export function isImage(blueprint) {
  return blueprint.fileType === 'image'
}
