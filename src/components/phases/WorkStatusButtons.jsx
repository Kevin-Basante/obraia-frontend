import { workActionLabel } from '../../utils/workStatus.js'

/** One button per status the phase or task can move to. `onChange(code)` makes the change. */
export function WorkStatusButtons({ item, onChange, busy }) {
  return item.nextStatuses.map((next) => (
    <button
      key={next.code}
      type="button"
      className={`button-small${next.code === 'delayed' ? ' button-secondary' : ''}`}
      disabled={busy}
      onClick={() => onChange(next.code)}
    >
      {workActionLabel(item.status.code, next.code)}
    </button>
  ))
}
