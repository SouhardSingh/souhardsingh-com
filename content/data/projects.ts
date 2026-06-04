import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'souhardsingh-com',
    title: 'souhardsingh.com',
    description: 'Personal site — writing, projects, travel, and a digital garden.',
    longDescription:
      'A Next.js 16 personal site with an MDX content pipeline, Tailwind 4 design system, dark mode, Framer Motion transitions, and a force-directed digital garden graph.',
    status: 'active',
    year: 2024,
    tags: ['Personal', 'Web'],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'MDX'],
    links: {
      github: 'https://github.com/souhardsingh/souhardsingh-com',
      live: 'https://souhardsingh.com',
    },
    featured: true,
  },
  {
    slug: 'example-api',
    title: 'Example API',
    description: 'High-throughput REST API with PostgreSQL and Redis caching.',
    longDescription:
      'Built with Go and deployed on Kubernetes. Handles 50k req/s with sub-10ms p99 latency.',
    status: 'complete',
    year: 2023,
    tags: ['Backend', 'Infrastructure'],
    tech: ['Go', 'PostgreSQL', 'Redis', 'Kubernetes'],
    links: {
      github: 'https://github.com/souhardsingh/example-api',
    },
    featured: true,
  },
  {
    slug: 'ml-pipeline',
    title: 'ML Training Pipeline',
    description: 'Distributed training pipeline for large language model fine-tuning.',
    longDescription:
      'Orchestrates multi-node GPU training jobs with checkpointing, experiment tracking via W&B, and automated hyperparameter search.',
    status: 'archived',
    year: 2023,
    tags: ['ML', 'Infrastructure'],
    tech: ['Python', 'PyTorch', 'Ray', 'SLURM'],
    links: {},
    featured: false,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
