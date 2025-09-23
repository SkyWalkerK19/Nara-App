// nara-app/lib/analyticsApi.ts
import { supabase } from './supabase'

export async function loadStudentAnalytics() {
  const [{ data: kpi }, { data: byYear }, { data: byMajor }] = await Promise.all([
    supabase.from('analytics_students_kpis').select('*').single(),
    supabase.from('analytics_students_by_year').select('*').order('grad_year'),
    supabase.from('analytics_students_by_major').select('*').order('n_students', { ascending: false }),
  ])

  return { kpi, byYear, byMajor }
}
