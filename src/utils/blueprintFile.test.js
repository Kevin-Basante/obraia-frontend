import { describe, expect, it } from 'vitest'
import { MAX_FILE_BYTES, isImage, validateBlueprintFile } from './blueprintFile.js'

/** A File-like object: only the name and size matter to the check. */
const file = (name, size = 1000) => ({ name, size })

describe('validateBlueprintFile', () => {
  it('accepts PDFs and images whatever the case of the extension', () => {
    expect(validateBlueprintFile(file('plano.pdf'))).toBeNull()
    expect(validateBlueprintFile(file('FOTO.JPG'))).toBeNull()
    expect(validateBlueprintFile(file('piso.webp'))).toBeNull()
  })

  it('asks for a file when none was chosen', () => {
    expect(validateBlueprintFile(null)).toBe('Choose a PDF or an image')
  })

  it('rejects other types, empty files and files over 10 MB', () => {
    expect(validateBlueprintFile(file('plano.dwg'))).toMatch(/PDF or an image/)
    expect(validateBlueprintFile(file('plano.pdf', 0))).toBe('The file is empty')
    expect(validateBlueprintFile(file('plano.pdf', MAX_FILE_BYTES + 1))).toMatch(/10 MB/)
  })
})

describe('isImage', () => {
  it('tells images from PDFs', () => {
    expect(isImage({ fileType: 'image' })).toBe(true)
    expect(isImage({ fileType: 'vector_pdf' })).toBe(false)
  })
})
