'use server';

import { redirect } from 'next/navigation';
import { AssessmentError, startOrResumeAttempt } from '@/lib/assessment/service';
import { requireStudent } from '@/lib/auth/dal';
import { studentAssignments } from '@/lib/school/student';

/** Öğrenci yalnızca sınıfına atanmış testleri başlatabilir; velinin açık rızası yoksa başlatamaz. */
export async function startAssignedTestAction(formData: FormData): Promise<void> {
  const student = await requireStudent('/ogrenci');
  const slug = String(formData.get('slug') ?? '');
  const assigned = await studentAssignments(student.id, student.grade);
  const a = assigned.find((x) => x.slug === slug);
  if (!a) redirect('/ogrenci?hata=atanmamis');
  if (a.state === 'started' && a.attemptId) redirect(`/uygulama/${a.attemptId}`);
  let attemptId: string;
  try {
    attemptId = await startOrResumeAttempt({ studentId: student.id, grade: student.grade, slug, startedByUserId: null });
  } catch (err) {
    if (err instanceof AssessmentError) redirect(`/ogrenci?hata=${err.code}`);
    throw err;
  }
  redirect(`/uygulama/${attemptId}`);
}
