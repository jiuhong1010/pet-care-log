import careMascot from '../assets/generated/care-mascot.png'
import medicationRelay from '../assets/generated/feature-illustrations/medication-relay-v1.png'
import observeChange from '../assets/generated/feature-illustrations/observe-change-v1.png'
import vaccineCare from '../assets/generated/feature-illustrations/vaccine-care-v1.png'
import vetVisit from '../assets/generated/feature-illustrations/vet-visit-v1.png'
import weightTrack from '../assets/generated/feature-illustrations/weight-track-v1.png'

const illustrations = {
  medication: medicationRelay,
  observation: observeChange,
  vaccine: vaccineCare,
  visit: vetVisit,
  visitPack: careMascot,
  weight: weightTrack,
} as const

export type FeatureIllustrationName = keyof typeof illustrations

export function FeatureIllustration({
  name,
  alt = '',
  className = '',
  eager = false,
}: {
  name: FeatureIllustrationName
  alt?: string
  className?: string
  eager?: boolean
}) {
  return (
    <img
      src={illustrations[name]}
      alt={alt}
      className={`feature-illustration ${className}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
