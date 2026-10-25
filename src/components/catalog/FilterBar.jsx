import './FilterBar.css'

/** Row of filters above a list. Wraps on small screens. */
export function FilterBar({ children }) {
  return (
    <div className="filter-bar" role="search">
      {children}
    </div>
  )
}
