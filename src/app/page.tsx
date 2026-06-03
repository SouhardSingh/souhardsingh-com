import { PageWrapper } from '@/components/layout/PageWrapper'

export default function HomePage() {
  return (
    <PageWrapper>
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <h1 className="font-display text-text text-4xl font-bold tracking-tight sm:text-5xl">
          Souhard Singh
        </h1>
        <p className="text-text-muted mt-4 max-w-xl text-lg">
          Software engineer, writer, and traveler. Building things on the internet.
        </p>
      </section>
    </PageWrapper>
  )
}
