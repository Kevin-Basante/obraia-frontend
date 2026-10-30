import { useRef, useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { ACCEPTED_FILES, validateBlueprintFile } from '../../utils/blueprintFile.js'
import '../FormField.css'

/** Picks a photo or PDF and uploads it. `onUpload(file)` sends it to the backend. */
export function BlueprintUploadForm({ onUpload }) {
  const [file, setFile] = useState(null)
  const [problem, setProblem] = useState(null)
  const inputRef = useRef(null)
  const { submit, pending, error } = useFormSubmit(onUpload)

  function handleChange(event) {
    const chosen = event.target.files[0] ?? null
    setFile(chosen)
    setProblem(chosen ? validateBlueprintFile(chosen) : null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validateBlueprintFile(file)
    if (found) {
      setProblem(found)
      return
    }
    const uploaded = await submit(file)
    if (uploaded) {
      setFile(null)
      inputRef.current.value = ''
    }
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="blueprint-file">Blueprint (PDF, PNG, JPG or WEBP, up to 10 MB)</label>
        <input
          ref={inputRef}
          id="blueprint-file"
          type="file"
          accept={ACCEPTED_FILES}
          onChange={handleChange}
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? 'blueprint-file-message' : undefined}
        />
        {problem && (
          <p id="blueprint-file-message" className="form-field__error">
            {problem}
          </p>
        )}
      </div>
      <SubmitButton pending={pending} pendingText="Uploading…">
        Upload
      </SubmitButton>
      <FormAlert>{error?.message}</FormAlert>
    </form>
  )
}
