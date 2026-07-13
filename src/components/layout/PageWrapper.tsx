'use client'

import { motion, useReducedMotion } from 'framer-motion'

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  return (
    // `initial` must not depend on `reduced`: it is always false during SSR, so branching on it
    // makes the server markup disagree with a reduced-motion client. Collapse the duration instead.
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
