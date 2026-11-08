import { MaterialName } from './MaterialName.jsx'
import { formatPercent, formatQuantity } from '../../utils/format.js'
import './DataTable.css'
import { codeText, t } from '../../i18n/i18n.js'

/** Groups the formulas by building element, keeping the order the backend sends. */
function groupByElement(formulas) {
  const groups = new Map()
  for (const formula of formulas) {
    if (!groups.has(formula.elementType)) {
      groups.set(formula.elementType, {
        label: codeText('element', formula.elementType, formula.elementLabel),
        baseUnit: formula.baseUnit,
        rows: [],
      })
    }
    groups.get(formula.elementType).rows.push(formula)
  }
  return [...groups.entries()]
}

/** Materials needed per unit of each building element (m³ of concrete, m² of wall…). */
export function FormulaTable({ formulas, updating }) {
  return (
    <div className={updating ? 'data-table--updating' : undefined}>
      {groupByElement(formulas).map(([element, group]) => (
        <table key={element} className="data-table formula-table">
          <caption>
            {group.label}{' '}
            <span className="muted">
              {t('formulaTable.per')} {group.baseUnit}
            </span>
          </caption>
          <thead>
            <tr>
              <th scope="col">{t('formulaTable.material')}</th>
              <th scope="col" className="data-table__number">
                {t('formulaTable.quantity')}
              </th>
              <th scope="col" className="data-table__number">
                {t('formulaTable.waste')}
              </th>
            </tr>
          </thead>
          <tbody>
            {group.rows.map((formula) => (
              <tr key={formula.materialId}>
                <td data-label={t('formulaTable.material')}>
                  <MaterialName name={formula.materialName} />
                </td>
                <td data-label={t('formulaTable.quantity')} className="data-table__number">
                  {formatQuantity(formula.consumptionPerUnit)} {formula.materialUnit}
                </td>
                <td data-label={t('formulaTable.waste')} className="data-table__number">
                  {formatPercent(formula.wasteFactor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  )
}
