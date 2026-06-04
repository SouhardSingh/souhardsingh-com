import { redirect } from 'next/navigation'

// /work → /work/projects until experience, architecture etc. are live
export default function WorkIndex() {
  redirect('/work/projects')
}
