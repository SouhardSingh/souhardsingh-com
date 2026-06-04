import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ExperienceItem } from '@/components/work/ExperienceItem'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { experience } from '@content/data/experience'

export const metadata: Metadata = {
  title: 'About',
  description: 'Software engineer, writer, and traveler.',
  openGraph: {
    title: 'About',
    description: 'Software engineer, writer, and traveler.',
    images: ['/og?title=About&type=page'],
  },
  twitter: { card: 'summary_large_image' },
}

const SKILLS = {
  Languages: ['TypeScript', 'Go', 'Python', 'SQL', 'Rust'],
  Frameworks: ['Next.js', 'React', 'Node.js', 'FastAPI', 'gRPC'],
  Infrastructure: ['Kubernetes', 'Terraform', 'Docker', 'PostgreSQL', 'Redis', 'Kafka'],
  Tools: ['Git', 'GitHub Actions', 'Grafana', 'Datadog', 'Linear'],
}

const PRINCIPLES = [
  {
    title: 'Simplicity is the prerequisite for reliability.',
    body: 'Every system you add is a system that can fail. I prefer boring, well-understood technology over clever novelty.',
  },
  {
    title: 'Write for the reader who comes after you.',
    body: 'That reader is almost always future you, six months from now, confused about why something works the way it does.',
  },
  {
    title: 'Ship small, learn fast.',
    body: 'A working prototype in production tomorrow teaches you more than a perfect design document today.',
  },
  {
    title: 'Measure before you optimize.',
    body: 'Intuitions about performance are wrong more often than they are right. Profile first.',
  },
]

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* Intro */}
        <section className="flex flex-col-reverse gap-10 md:flex-row md:items-start md:gap-16">
          <div className="flex-1">
            <h1 className="font-display text-text text-4xl font-bold tracking-tight sm:text-5xl">
              About
            </h1>
            <div className="text-text-muted mt-6 space-y-4 text-lg leading-relaxed">
              <p>
                I am a software engineer who cares about the craft — writing systems that are fast,
                maintainable, and honest about their trade-offs. I have worked across the stack but
                spend most of my time in backend infrastructure and distributed systems.
              </p>
              <p>
                Outside of engineering I write, travel, and collect interesting problems. This site
                is my corner of the internet: a place to share what I am building, what I am
                reading, and where I have been.
              </p>
            </div>
          </div>

          {/* Photo placeholder */}
          <div className="bg-surface-2 border-border mx-auto h-48 w-48 shrink-0 rounded-2xl border md:mx-0 md:h-56 md:w-56" />
        </section>

        <Separator className="my-14" />

        {/* Skills */}
        <section>
          <h2 className="text-text mb-6 text-xl font-semibold">Skills</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Object.entries(SKILLS).map(([category, skills]) => (
              <div key={category}>
                <h3 className="text-text-muted mb-2.5 text-xs font-semibold tracking-widest uppercase">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-14" />

        {/* Career timeline */}
        <section>
          <h2 className="text-text mb-8 text-xl font-semibold">Experience</h2>
          <div className="relative">
            {experience.map((item, i) => (
              <ExperienceItem key={`${item.company}-${i}`} item={item} index={i} />
            ))}
          </div>
        </section>

        <Separator className="my-14" />

        {/* Principles */}
        <section>
          <h2 className="text-text mb-8 text-xl font-semibold">Things I believe</h2>
          <div className="space-y-6">
            {PRINCIPLES.map((p) => (
              <blockquote key={p.title} className="border-accent border-l-4 pl-5">
                <p className="text-text font-medium italic">&ldquo;{p.title}&rdquo;</p>
                <p className="text-text-muted mt-1.5 text-sm leading-relaxed">{p.body}</p>
              </blockquote>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
