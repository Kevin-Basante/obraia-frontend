import { RevealSection } from './RevealSection.jsx'
import './FeatureGrid.css'
import { t } from '../../i18n/i18n.js'

// Read in each render, so the texts follow the language.
function features() {
  return [
    { title: t('featureGrid.pricesOfYourCity'), text: t('featureGrid.referencePricesAndTransportBy') },
    { title: t('featureGrid.aiAndYourEye'), text: t('featureGrid.theAiMeasuresYouCheck') },
    { title: t('featureGrid.budgetVersions'), text: t('featureGrid.compareDraftsAndApproveThe') },
    { title: t('featureGrid.workInPhases'), text: t('featureGrid.aPlanPerProjectType') },
    { title: t('featureGrid.earlyWarnings'), text: t('featureGrid.notificationsWhenSpendingPassesThe') },
    { title: t('featureGrid.builtAsATeam'), text: t('featureGrid.inviteThePeopleWhoManage') },
  ]
}

/** What a user gets, in short sentences. */
export function FeatureGrid() {
  return (
    <RevealSection className="feature-grid" aria-labelledby="feature-grid-title">
      <div className="feature-grid__intro">
        <p className="landing-eyebrow">{t('featureGrid.madeForSmallBuilds')}</p>
        <h2 id="feature-grid-title">{t('featureGrid.everythingAHouseNeedsIn')}</h2>
        <p className="muted">{t('featureGrid.familiesAndSmallBuildersPlan')}</p>
      </div>
      <ul className="feature-grid__list">
        {features().map((feature, index) => (
          <li key={feature.title} style={{ '--step': index }}>
            <h3>{feature.title}</h3>
            <p className="muted">{feature.text}</p>
          </li>
        ))}
      </ul>
    </RevealSection>
  )
}
