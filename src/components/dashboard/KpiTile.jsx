import './KpiTile.css'

/**
 * One key number of a dashboard: a label, the value in big type and a line
 * that explains it. `tone` (ok, warn, bad or neutral) colors the top edge,
 * and `children` can add a bar or a badge under the value.
 */
export function KpiTile({ label, value, detail, tone = 'neutral', children }) {
  return (
    <section className={`kpi-tile kpi-tile--${tone}`}>
      <h3 className="kpi-tile__label">{label}</h3>
      <p className="kpi-tile__value">{value}</p>
      {children}
      {detail && <p className="kpi-tile__detail">{detail}</p>}
    </section>
  )
}
