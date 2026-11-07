import { useCallback } from 'react'
import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormAlert } from '../../components/FormAlert.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ExpenseForm } from '../../components/expenses/ExpenseForm.jsx'
import { ExpenseSummary } from '../../components/expenses/ExpenseSummary.jsx'
import { ExpenseTable } from '../../components/expenses/ExpenseTable.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { createExpense, deleteExpense, getExpenseSummary, listExpenses } from '../../services/expenseService.js'
import { getWorkPlan } from '../../services/phaseService.js'
import { getProject } from '../../services/projectService.js'
import { isClosed } from '../../utils/projectStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** Money really spent on a project: register and delete expenses and compare them with the budget. */
export function ExpensesPage() {
  const { id } = useParams()
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const plan = useApiData((signal) => getWorkPlan(id, { signal }), [id])
  const expenses = useApiData((signal) => listExpenses(id, { signal }), [id])
  const summary = useApiData((signal) => getExpenseSummary(id, { signal }), [id])
  const retryExpenses = expenses.retry
  const retrySummary = summary.retry

  const reload = useCallback(() => {
    retryExpenses()
    retrySummary()
  }, [retryExpenses, retrySummary])
  const save = useCallback(
    async (request) => {
      const saved = await createExpense(id, request)
      reload()
      return saved
    },
    [id, reload],
  )
  const remove = useCallback((expenseId) => deleteExpense(id, expenseId).then(reload), [id, reload])
  const removing = useFormSubmit(remove)

  if (project.error?.status === 404) return <NotFoundPage />
  const failed = [project, plan, expenses, summary].find((request) => request.status === 'error')
  if (failed) return <ErrorState error={failed.error} onRetry={failed.retry} />
  if (!project.data || !plan.data || !expenses.data || !summary.data) {
    return <LoadingState title="Loading the expenses…" />
  }

  const closed = isClosed(project.data)

  function handleDelete(expense) {
    if (window.confirm(`Delete the expense "${expense.description}"?`)) removing.submit(expense.id)
  }

  return (
    <div className="workspace">
      <PageHeader
        title="Expenses"
        description={`${project.data.name} · money really spent on the work`}
        back={{ to: `/projects/${id}`, label: project.data.name }}
      />
      <div className="workspace__split">
        {!closed && (
          <section className="card">
            <h2>Register an expense</h2>
            <p className="muted">
              Each expense updates the approved budget and the risk of the project. Members are notified when the
              expenses pass the budget.
            </p>
            <ExpenseForm phases={plan.data.phases} onSave={save} />
          </section>
        )}
        <section className="card">
          <h2>Spent against the budget</h2>
          <ExpenseSummary summary={summary.data} />
        </section>
      </div>
      <section className="card">
        <h2>Expenses</h2>
        {closed && <p className="muted">The project is closed: the expenses can be read but not changed.</p>}
        {expenses.data.length === 0 ? (
          <p className="muted">There are no expenses yet.</p>
        ) : (
          <ExpenseTable expenses={expenses.data} onDelete={closed ? undefined : handleDelete} busy={removing.pending} />
        )}
        <FormAlert>{removing.error?.message}</FormAlert>
      </section>
    </div>
  )
}
