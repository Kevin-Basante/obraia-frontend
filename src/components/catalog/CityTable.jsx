import { formatPercent } from '../../utils/format.js'
import './DataTable.css'
import { t } from '../../i18n/i18n.js'

/** Cities with their department, country and the transport rate that quotations add. */
export function CityTable({ cities, updating }) {
  return (
    <div className="card">
      <table className={`data-table${updating ? ' data-table--updating' : ''}`}>
        <thead>
          <tr>
            <th scope="col">{t('cityTable.city')}</th>
            <th scope="col">{t('cityTable.department')}</th>
            <th scope="col">{t('cityTable.country')}</th>
            <th scope="col" className="data-table__number">
              {t('cityTable.transport')}
            </th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td data-label={t('cityTable.city')}>{city.city}</td>
              <td data-label={t('cityTable.department')}>{city.department}</td>
              <td data-label={t('cityTable.country')}>{city.country}</td>
              <td data-label={t('cityTable.transport')} className="data-table__number">
                {formatPercent(Number(city.transportPct) / 100)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
