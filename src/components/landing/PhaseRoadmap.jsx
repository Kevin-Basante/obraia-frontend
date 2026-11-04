import { LineArt } from '../art/LineArt.jsx'
import { useInView } from '../../hooks/useInView.js'
import './PhaseRoadmap.css'

const PHASES = [
  { art: 'survey', title: 'Site prep and layout', text: 'Clean the lot and mark the axes on the ground.' },
  { art: 'excavation', title: 'Excavation', text: 'Dig the trenches for the footings.' },
  { art: 'foundation', title: 'Foundations', text: 'Footings and tie beams with their steel.' },
  { art: 'structure', title: 'Structure', text: 'Columns, beams and slabs.' },
  { art: 'masonry', title: 'Masonry', text: 'Block walls between the columns.' },
  { art: 'roof', title: 'Roof', text: 'Trusses and roof sheets.' },
  { art: 'installations', title: 'Plumbing and wiring', text: 'Water, drains and electricity.' },
  { art: 'finishes', title: 'Finishes', text: 'Plaster, floors and paint.' },
]

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
        <p className="landing-eyebrow">The roadmap</p>
        <h2 id="phase-roadmap-title">Eight phases, from the first stake to the last coat of paint</h2>
        <p className="muted">
          Every project gets this plan with durations by size. You follow each phase with tasks, dates and progress
          reports.
        </p>
      </div>
      <ol className="phase-roadmap__list">
        {PHASES.map((phase, index) => (
          <li key={phase.art} className="phase-roadmap__step" style={{ '--step': index }}>
            <span className="phase-roadmap__number tech-label">Phase {String(index + 1).padStart(2, '0')}</span>
            <div className="phase-roadmap__art">{inView && <LineArt set="phase" art={phase.art} animated />}</div>
            <h3>{phase.title}</h3>
            <p className="muted">{phase.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
