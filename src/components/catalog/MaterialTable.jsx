import { formatCurrency, formatDate } from '../../utils/format.js'
import './DataTable.css'

/** Materials with their unit and reference price. */
export function MaterialTable({ materials, updating }) {
  return (
    <div className="card">
      <table className={`data-table${updating ? ' data-table--updating' : ''}`}>
        <thead>
          <tr>
            <th scope="col">Material</th>
            <th scope="col">Category</th>
            <th scope="col">Unit</th>
            <th scope="col" className="data-table__number">
              Reference price
            </th>
            <th scope="col">Price date</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.id}>
              <td data-label="Material">{material.name}</td>
              <td data-label="Category">{material.category.label}</td>
              <td data-label="Unit">{material.unit}</td>
              <td data-label="Reference price" className="data-table__number">
                {formatCurrency(material.referencePrice)}
              </td>
              <td data-label="Price date">{formatDate(material.priceUpdatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
