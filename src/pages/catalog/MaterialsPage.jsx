import { useState } from 'react'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormField } from '../../components/FormField.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { SelectField } from '../../components/SelectField.jsx'
import { EmptyState } from '../../components/catalog/EmptyState.jsx'
import { FilterBar } from '../../components/catalog/FilterBar.jsx'
import { MaterialTable } from '../../components/catalog/MaterialTable.jsx'
import { ResultCount } from '../../components/catalog/ResultCount.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { getMaterialCategories, getMaterials } from '../../services/catalogService.js'

/** Material catalog with filters by category and name. */
export function MaterialsPage() {
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const categories = useApiData((signal) => getMaterialCategories({ signal }), [])
  const materials = useApiData(
    (signal) => getMaterials({ category, search: debouncedSearch }, { signal }),
    [category, debouncedSearch],
  )

  const categoryOptions = (categories.data ?? []).map((item) => ({ value: item.code, label: item.label }))

  return (
    <>
      <FilterBar>
        <FormField
          label="Search"
          type="search"
          placeholder="Cement, sand, block…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectField
          label="Category"
          placeholder="All categories"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </FilterBar>

      {materials.status === 'error' && <ErrorState error={materials.error} onRetry={materials.retry} />}
      {materials.status === 'loading' && !materials.data && <LoadingState title="Loading materials…" />}
      {materials.data && materials.status !== 'error' && (
        <>
          <ResultCount
            count={materials.data.length}
            singular="material"
            plural="materials"
            updating={materials.status === 'loading'}
          />
          {materials.data.length === 0 ? (
            <EmptyState>No materials match these filters.</EmptyState>
          ) : (
            <MaterialTable materials={materials.data} updating={materials.status === 'loading'} />
          )}
        </>
      )}
    </>
  )
}
