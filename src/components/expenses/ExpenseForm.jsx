import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { FormField } from '../FormField.jsx'
import { SelectField } from '../SelectField.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import {
  EMPTY_EXPENSE_FORM,
  expenseCategoryOptions,
  toExpenseRequest,
  validateExpense,
} from '../../utils/expenseForm.js'
import { todayIso } from '../../utils/progressForm.js'
import '../measurements/MeasurementForm.css'
import { t } from '../../i18n/i18n.js'

/**
 * Form to register an expense. The phase is optional and the date is today
 * when it is left empty. `onSave(request)` sends it.
 */
export function ExpenseForm({ phases, onSave }) {
  const [form, setForm] = useState(EMPTY_EXPENSE_FORM)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(onSave)
  const phaseOptions = phases.map((phase) => ({ value: phase.id, label: phase.name }))

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
      setFieldErrors((current) => {
        if (!current[field]) return current
        const rest = { ...current }
        delete rest[field]
        return rest
      })
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validateExpense(form)
    if (Object.keys(found).length > 0) {
      setFieldErrors(found)
      return
    }
    const saved = await submit(toExpenseRequest(form))
    if (saved) setForm(EMPTY_EXPENSE_FORM)
  }

  return (
    <form className="measurement-form" onSubmit={handleSubmit} noValidate>
      <FormAlert>{error && !error.fields && error.message}</FormAlert>
      <div className="measurement-form__row">
        <SelectField
          label={t('expenseForm.category')}
          placeholder={t('expenseForm.chooseACategory')}
          options={expenseCategoryOptions()}
          value={form.category}
          onChange={update('category')}
          error={fieldErrors.category}
        />
        <FormField
          label={t('expenseForm.amountCop')}
          inputMode="decimal"
          placeholder="650.000"
          value={form.amount}
          onChange={update('amount')}
          error={fieldErrors.amount}
        />
        <FormField
          label={t('expenseForm.date')}
          type="date"
          max={todayIso()}
          value={form.expenseDate}
          onChange={update('expenseDate')}
          error={fieldErrors.expenseDate}
          hint={t('expenseForm.emptyMeansToday')}
        />
      </div>
      <div className="measurement-form__row">
        <FormField
          label={t('expenseForm.description')}
          placeholder={t('expenseForm.cementoGrisX20Bultos')}
          value={form.description}
          onChange={update('description')}
          error={fieldErrors.description}
        />
        {phaseOptions.length > 0 && (
          <SelectField
            label={t('expenseForm.phaseOptional')}
            placeholder={t('expenseForm.noPhase')}
            options={phaseOptions}
            value={form.phaseId}
            onChange={update('phaseId')}
            error={fieldErrors.phaseId}
          />
        )}
      </div>
      <div className="button-row">
        <SubmitButton pending={pending} pendingText={t('expenseForm.saving')}>
          {t('expenseForm.registerExpense')}
        </SubmitButton>
      </div>
    </form>
  )
}
