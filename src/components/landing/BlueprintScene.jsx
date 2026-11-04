import { useCountUp } from '../../hooks/useCountUp.js'
import { formatCurrency } from '../../utils/format.js'
import './BlueprintScene.css'

// Walls of a small house. pathLength="1" lets CSS draw every line from 0 to 1, whatever its size.
const WALLS = [
  'M40 40H440V300H40Z',
  'M200 40V130M200 180V300',
  'M200 170H260M300 170H440',
  'M320 40V170',
]

const DETAILS = [
  // Doors: the leaf and the arc it sweeps.
  'M200 130A50 50 0 0 1 150 180',
  'M260 170A40 40 0 0 0 300 130',
  'M110 300A40 40 0 0 1 70 260',
  // Windows on the outer walls.
  'M80 40H160M80 46H160',
  'M360 300H420M360 294H420',
  'M440 210V260M434 210V260',
]

const DIMENSIONS = ['M40 18H440M40 12V24M440 12V24', 'M18 40V300M12 40H24M12 300H24']

const ROOMS = [
  { x: 120, y: 110, name: 'Living room' },
  { x: 380, y: 105, name: 'Bedroom' },
  { x: 260, y: 105, name: 'Bath' },
  { x: 320, y: 240, name: 'Kitchen' },
]

const FOUND = [
  { label: 'Walls', value: '58,8 m²', className: 'blueprint-scene__chip--walls' },
  { label: 'Floor', value: '47,1 m²', className: 'blueprint-scene__chip--floor' },
  { label: 'Slab', value: '5,6 m³', className: 'blueprint-scene__chip--slab' },
]

const BUDGET = 48_750_000

/** A blueprint that draws itself, is read by the AI and turns into a budget: what ObraIA does. */
export function BlueprintScene() {
  const budget = useCountUp(BUDGET, { delay: 2600, duration: 1800 })

  return (
    <div className="blueprint-scene" aria-hidden="true">
      <div className="blueprint-scene__sheet">
        <svg viewBox="0 0 480 340" className="blueprint-scene__plan">
          <defs>
            <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" className="blueprint-scene__grid" />
            </pattern>
            <linearGradient id="blueprint-scan" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <rect width="480" height="340" fill="url(#blueprint-grid)" />
          {DIMENSIONS.map((d) => (
            <path key={d} d={d} pathLength="1" className="blueprint-scene__line blueprint-scene__dimension" />
          ))}
          <text x="240" y="10" className="blueprint-scene__measure">
            12,0 m
          </text>
          <text x="8" y="170" transform="rotate(-90 8 170)" className="blueprint-scene__measure">
            7,8 m
          </text>
          {WALLS.map((d, index) => (
            <path
              key={d}
              d={d}
              pathLength="1"
              className="blueprint-scene__line blueprint-scene__wall"
              style={{ animationDelay: `${0.2 + index * 0.25}s` }}
            />
          ))}
          {DETAILS.map((d, index) => (
            <path
              key={d}
              d={d}
              pathLength="1"
              className="blueprint-scene__line blueprint-scene__detail"
              style={{ animationDelay: `${1.2 + index * 0.1}s` }}
            />
          ))}
          {ROOMS.map((room) => (
            <text key={room.name} x={room.x} y={room.y} className="blueprint-scene__room">
              {room.name}
            </text>
          ))}
          <rect x="30" y="-60" width="420" height="60" fill="url(#blueprint-scan)" className="blueprint-scene__scan" />
        </svg>
        <div className="blueprint-scene__title-block">
          <span>Plan A-01 · Ground floor</span>
          <span>Scale 1:100</span>
        </div>
      </div>

      <ul className="blueprint-scene__chips">
        {FOUND.map((item, index) => (
          <li
            key={item.label}
            className={`blueprint-scene__chip ${item.className}`}
            style={{ animationDelay: `${2.4 + index * 0.18}s` }}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </li>
        ))}
      </ul>

      <div className="blueprint-scene__budget">
        <span>Estimated budget</span>
        <strong>{formatCurrency(budget)}</strong>
        <span className="blueprint-scene__bar">
          <span />
        </span>
      </div>
    </div>
  )
}
