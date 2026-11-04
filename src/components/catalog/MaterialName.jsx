import { LineArt } from '../art/LineArt.jsx'
import { materialArt } from '../../utils/artFor.js'

/** Name of a material with its small drawing in front, for table rows. */
export function MaterialName({ name, category }) {
  return (
    <span className="material-name">
      <span className="material-name__art">
        <LineArt set="material" art={materialArt({ name, category })} />
      </span>
      {name}
    </span>
  )
}
