import { formatPercent } from '../../utils/format.js'
import './DataTable.css'

/** Cities with their department, country and the transport rate that quotations add. */
export function CityTable({ cities, updating }) {
  return (
    <div className="card">
      <table className={`data-table${updating ? ' data-table--updating' : ''}`}>
        <thead>
          <tr>
            <th scope="col">City</th>
            <th scope="col">Department</th>
            <th scope="col">Country</th>
            <th scope="col" className="data-table__number">
              Transport
            </th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td data-label="City">{city.city}</td>
              <td data-label="Department">{city.department}</td>
              <td data-label="Country">{city.country}</td>
              <td data-label="Transport" className="data-table__number">
                {formatPercent(Number(city.transportPct) / 100)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
