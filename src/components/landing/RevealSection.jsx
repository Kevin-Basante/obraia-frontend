import { useInView } from '../../hooks/useInView.js'

/** A section that rises into place the first time it appears on the screen. */
export function RevealSection({ className = '', children, ...props }) {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} className={`reveal ${inView ? 'reveal--visible' : ''} ${className}`.trim()} {...props}>
      {children}
    </section>
  )
}
