import { useState } from 'react'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormField } from '../../components/FormField.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { SelectField } from '../../components/SelectField.jsx'
import { CityTable } from '../../components/catalog/CityTable.jsx'
import { EmptyState } from '../../components/catalog/EmptyState.jsx'
import { FilterBar } from '../../components/catalog/FilterBar.jsx'
import { ResultCount } from '../../components/catalog/ResultCount.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { getDepartments, getLocations } from '../../services/catalogService.js'
import { t } from '../../i18n/i18n.js'

/** Cities where projects can be built, with filters by department and name. */
export function CitiesPage() {
  const [department, setDepartment] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const departments = useApiData((signal) => getDepartments({ signal }), [])
  const cities = useApiData(
    (signal) => getLocations({ department, search: debouncedSearch }, { signal }),
    [department, debouncedSearch],
  )

  const departmentOptions = (departments.data ?? []).map((name) => ({ value: name, label: name }))
  const updating = cities.status === 'loading'

  return (
    <>
      <FilterBar>
        <FormField
          label={t('citiesPage.search')}
          type="search"
          placeholder={t('citiesPage.cityName')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectField
          label={t('citiesPage.department')}
          placeholder={t('citiesPage.allDepartments')}
          options={departmentOptions}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </FilterBar>

      {cities.status === 'error' && <ErrorState error={cities.error} onRetry={cities.retry} />}
      {cities.status === 'loading' && !cities.data && <LoadingState title={t('citiesPage.loadingCities')} />}
      {cities.data && cities.status !== 'error' && (
        <>
          <ResultCount count={cities.data.length} noun="city" updating={updating} />
          {cities.data.length === 0 ? (
            <EmptyState>{t('citiesPage.noCitiesMatchTheseFilters')}</EmptyState>
          ) : (
            <CityTable cities={cities.data} updating={updating} />
          )}
        </>
      )}
    </>
  )
}
