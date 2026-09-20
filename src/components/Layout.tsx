import Footer from './Footer'
import { cn } from '@/utils/ui'
import type React from 'react'

type LayoutProps = {
  children: React.ReactNode
  /** Lock to the viewport (typing). Gallery-style pages should grow and scroll with the document. */
  fillViewport?: boolean
}

export default function Layout({ children, fillViewport = true }: LayoutProps) {
  return (
    <main
      className={cn(
        'flex w-full max-w-full flex-col items-stretch overflow-x-clip pb-[max(1rem,env(safe-area-inset-bottom))]',
        fillViewport ? 'h-dvh max-h-dvh overflow-y-auto' : 'min-h-dvh',
      )}
    >
      {children}
      <Footer />
    </main>
  )
}
