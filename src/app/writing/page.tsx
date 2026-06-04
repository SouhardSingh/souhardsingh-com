import { redirect } from 'next/navigation'

// /writing → /writing/blog until garden, building etc. are live
export default function WritingIndex() {
  redirect('/writing/blog')
}
