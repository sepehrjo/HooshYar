import { redirect } from 'next/navigation';
import type { Locale } from '@/types/locale';

export default async function ProcessPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect(`/${locale}#process`);
}
