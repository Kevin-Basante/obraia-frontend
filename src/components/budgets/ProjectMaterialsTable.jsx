import { MaterialName } from '../catalog/MaterialName.jsx'
import { materialsTotal } from '../../utils/budget.js'
import { formatCurrency, formatQuantity } from '../../utils/format.js'
import '../catalog/DataTable.css'
import './CostBreakdown.css'
import { t } from '../../i18n/i18n.js'

/** Materials to buy, waste included, with the price used in the quotation. */
export function ProjectMaterialsTable({ materials }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">{t('projectMaterialsTable.material')}</th>
          <th scope="col">{t('projectMaterialsTable.unit')}</th>
          <th scope="col" className="data-table__number">
            {t('projectMaterialsTable.quantity')}
          </th>
          <th scope="col" className="data-table__number">
            {t('projectMaterialsTable.unitPrice')}
          </th>
          <th scope="col" className="data-table__number">
            {t('projectMaterialsTable.subtotal')}
          </th>
        </tr>
      </thead>
      <tbody>
        {materials.map((material) => (
          <tr key={material.materialId}>
            <td data-label={t('projectMaterialsTable.material')}>
              <MaterialName name={material.name} />
            </td>
            <td data-label={t('projectMaterialsTable.unit')}>{material.unit}</td>
            <td data-label={t('projectMaterialsTable.quantity')} className="data-table__number">
              {formatQuantity(material.quantity)}
            </td>
            <td data-label={t('projectMaterialsTable.unitPrice')} className="data-table__number">
              {formatCurrency(material.unitPrice)}
            </td>
            <td data-label={t('projectMaterialsTable.subtotal')} className="data-table__number">
              {formatCurrency(material.subtotal)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="cost-breakdown__total">
          <th scope="row" colSpan={4}>
            {t('projectMaterialsTable.totalMaterials')}
          </th>
          <td data-label={t('projectMaterialsTable.totalMaterials')} className="data-table__number">
            {formatCurrency(materialsTotal(materials))}
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
