import type { Book } from '@/types'

export const books: Book[] = [
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas, Andrew Hunt',
    year: 1999,
    status: 'read',
    rating: 5,
    note: 'The single most impactful book on how I think about software craft.',
    dateRead: '2021-03',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    year: 2011,
    status: 'read',
    rating: 5,
    note: 'Changed how I reason about uncertainty and cognitive bias.',
    dateRead: '2022-07',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    year: 2017,
    status: 'read',
    rating: 5,
    note: 'The distributed systems bible. Read it twice.',
    dateRead: '2023-01',
  },
  {
    title: 'The Creative Act',
    author: 'Rick Rubin',
    year: 2023,
    status: 'read',
    rating: 4,
    note: 'Surprisingly useful framing for shipping software, not just art.',
    dateRead: '2023-09',
  },
  {
    title: 'Gödel, Escher, Bach',
    author: 'Douglas Hofstadter',
    year: 1979,
    status: 'reading',
    rating: 5,
    note: "The kind of book you can't rush.",
  },
  {
    title: "The Staff Engineer's Path",
    author: 'Tanya Reilly',
    year: 2022,
    status: 'want',
  },
]
