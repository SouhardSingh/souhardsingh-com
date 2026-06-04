import type { ExperienceItem } from '@/types'

export const experience: ExperienceItem[] = [
  {
    company: 'Acme Corp',
    role: 'Senior Software Engineer',
    period: '2022 – Present',
    description:
      'Led backend platform team. Rebuilt the core data ingestion pipeline, reducing end-to-end latency by 60% and cutting infra costs by 40%.',
    tech: ['Go', 'Kubernetes', 'PostgreSQL', 'Kafka'],
    link: 'https://acme.com',
  },
  {
    company: 'Startup XYZ',
    role: 'Software Engineer',
    period: '2020 – 2022',
    description:
      'Full-stack engineer on the growth team. Shipped A/B testing framework and rebuilt the onboarding flow, improving activation rate by 25%.',
    tech: ['TypeScript', 'React', 'Node.js', 'Postgres'],
    link: 'https://startupxyz.com',
  },
  {
    company: 'University Research Lab',
    role: 'Research Engineer Intern',
    period: '2019 – 2020',
    description:
      'Built data pipelines for NLP research. Co-authored paper on low-resource multilingual transfer learning.',
    tech: ['Python', 'PyTorch', 'HuggingFace'],
  },
]
