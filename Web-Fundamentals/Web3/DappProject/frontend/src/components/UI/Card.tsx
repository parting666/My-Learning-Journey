import type { PropsWithChildren, ReactNode } from 'react'

type CardProps = PropsWithChildren<{
  title?: ReactNode
  description?: ReactNode
  className?: string
}>

export default function Card({ title, description, className, children }: CardProps) {
  return (
    <section className={`rounded-lg border border-gray-700 bg-gray-800 p-4 md:p-5 ${className ?? ''}`}>
      {(title || description) && (
        <header className="mb-3">
          {title && <h2 className="text-sm font-medium">{title}</h2>}
          {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </header>
      )}
      {children}
    </section>
  )
}