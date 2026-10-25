import './DataTable.css'

/** Cities with their department and country. */
export function CityTable({ cities, updating }) {
  return (
    <div className="card">
      <table className={`data-table${updating ? ' data-table--updating' : ''}`}>
        <thead>
          <tr>
            <th scope="col">City</th>
            <th scope="col">Department</th>
            <th scope="col">Country</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td data-label="City">{city.city}</td>
              <td data-label="Department">{city.department}</td>
              <td data-label="Country">{city.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
