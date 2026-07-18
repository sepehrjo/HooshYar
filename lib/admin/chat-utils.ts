import type {ChatSession} from '@/lib/kv';

export function truncateText(text: string, max = 48): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function getFirstUserMessage(session: ChatSession): string {
  const first = session.messages.find(m => m.role === 'user');
  return first?.content ?? '';
}

export function getMessageCount(session: ChatSession): number {
  return session.messages.filter(m => m.role === 'user').length;
}

export function formatRelativeTime(
  isoDate: string,
  locale: 'fa' | 'en',
  labels: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  }
): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return labels.justNow;
  if (minutes < 60) {
    return locale === 'fa'
      ? `${minutes} ${labels.minutesAgo}`
      : `${minutes} ${labels.minutesAgo}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return locale === 'fa'
      ? `${hours} ${labels.hoursAgo}`
      : `${hours} ${labels.hoursAgo}`;
  }

  const days = Math.floor(hours / 24);
  return locale === 'fa'
    ? `${days} ${labels.daysAgo}`
    : `${days} ${labels.daysAgo}`;
}

export function formatMessageTime(
  isoDate: string,
  locale: 'fa' | 'en'
): string {
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export function getLocaleFlag(sessionLocale: string): string {
  return sessionLocale === 'fa' ? '🇮🇷' : '🇬🇧';
}
