import { LineArt } from '../art/LineArt.jsx'
import { useInView } from '../../hooks/useInView.js'
import './PhaseRoadmap.css'
import { t } from '../../i18n/i18n.js'

// Read in each render, so the texts follow the language.
function phases() {
  return [
    { art: 'survey', title: t('phaseRoadmap.sitePrepAndLayout'), text: t('phaseRoadmap.cleanTheLotAndMark') },
    { art: 'excavation', title: t('phaseRoadmap.excavation'), text: t('phaseRoadmap.digTheTrenchesForThe') },
    { art: 'foundation', title: t('phaseRoadmap.foundations'), text: t('phaseRoadmap.footingsAndTieBeamsWith') },
    { art: 'structure', title: t('phaseRoadmap.structure'), text: t('phaseRoadmap.columnsBeamsAndSlabs') },
    { art: 'masonry', title: t('phaseRoadmap.masonry'), text: t('phaseRoadmap.blockWallsBetweenTheColumns') },
    { art: 'roof', title: t('phaseRoadmap.roof'), text: t('phaseRoadmap.trussesAndRoofSheets') },
    {
      art: 'installations',
      title: t('phaseRoadmap.plumbingAndWiring'),
      text: t('phaseRoadmap.waterDrainsAndElectricity'),
    },
    { art: 'finishes', title: t('phaseRoadmap.finishes'), text: t('phaseRoadmap.plasterFloorsAndPaint') },
  ]
}

/** The eight phases ObraIA plans for a house, drawn as a construction sheet. */
export function PhaseRoadmap() {
  const [ref, inView] = useInView({ threshold: 0.15 })

  return (
    <section
      ref={ref}
      className={`phase-roadmap reveal ${inView ? 'reveal--visible' : ''}`.trim()}
      aria-labelledby="phase-roadmap-title"
    >
      <div className="phase-roadmap__intro">
        <p className="landing-eyebrow">{t('phaseRoadmap.theRoadmap')}</p>
        <h2 id="phase-roadmap-title">{t('phaseRoadmap.eightPhasesFromTheFirst')}</h2>
        <p className="muted">{t('phaseRoadmap.everyProjectGetsThisPlan')}</p>
      </div>
      <ol className="phase-roadmap__list">
        {phases().map((phase, index) => (
          <li key={phase.art} className="phase-roadmap__step" style={{ '--step': index }}>
            <span className="phase-roadmap__number tech-label">
              {t('phaseRoadmap.phase')} {String(index + 1).padStart(2, '0')}
            </span>
            <div className="phase-roadmap__art">{inView && <LineArt set="phase" art={phase.art} animated />}</div>
            <h3>{phase.title}</h3>
            <p className="muted">{phase.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
