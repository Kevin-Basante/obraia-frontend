import { materialsTotal } from '../../utils/budget.js'
import { formatCurrency, formatQuantity } from '../../utils/format.js'
import '../catalog/DataTable.css'
import './CostBreakdown.css'

/** Materials to buy, waste included, with the price used in the quotation. */
export function ProjectMaterialsTable({ materials }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Material</th>
          <th scope="col">Unit</th>
          <th scope="col" className="data-table__number">
            Quantity
          </th>
          <th scope="col" className="data-table__number">
            Unit price
          </th>
          <th scope="col" className="data-table__number">
            Subtotal
          </th>
        </tr>
      </thead>
      <tbody>
        {materials.map((material) => (
          <tr key={material.materialId}>
            <td data-label="Material">{material.name}</td>
            <td data-label="Unit">{material.unit}</td>
            <td data-label="Quantity" className="data-table__number">
              {formatQuantity(material.quantity)}
            </td>
            <td data-label="Unit price" className="data-table__number">
              {formatCurrency(material.unitPrice)}
            </td>
            <td data-label="Subtotal" className="data-table__number">
              {formatCurrency(material.subtotal)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="cost-breakdown__total">
          <th scope="row" colSpan={4}>
            Total materials
          </th>
          <td data-label="Total materials" className="data-table__number">
            {formatCurrency(materialsTotal(materials))}
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
