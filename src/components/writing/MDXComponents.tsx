import type { MDXComponents } from 'mdx/types'
import { MdxImage } from './MdxImage'

export const mdxComponents: MDXComponents = {
  h2: ({ children, id, ...props }) => (
    <h2
      id={id}
      className="font-display text-text mt-10 mb-4 scroll-mt-24 text-2xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3
      id={id}
      className="font-display text-text mt-8 mb-3 scroll-mt-24 text-xl font-semibold"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-text-muted my-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="text-text-muted my-4 list-disc space-y-1 pl-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="text-text-muted my-4 list-decimal space-y-1 pl-6" {...props}>
      {children}
    </ol>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-accent text-text-muted my-6 border-l-4 pl-4 italic" {...props}>
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-8" />,
  img: MdxImage,
  Callout: ({
    type = 'info',
    children,
  }: {
    type?: 'info' | 'warning' | 'tip' | 'danger'
    children: React.ReactNode
  }) => {
    const styles = {
      info: 'bg-surface border-border',
      warning: 'bg-accent/10 border-accent/40',
      tip: 'bg-green/10 border-green/40',
      danger: 'bg-terracotta/10 border-terracotta/40',
    }
    return (
      <aside className={`my-6 rounded-lg border p-4 text-sm leading-relaxed ${styles[type]}`}>
        {children}
      </aside>
    )
  },
  Aside: ({ children }: { children: React.ReactNode }) => (
    <aside className="text-text-muted border-border bg-surface my-6 rounded-lg border-l-4 p-4 text-sm leading-relaxed italic">
      {children}
    </aside>
  ),
}
