import type {Lead} from '@/lib/kv';

const SERVICE_COLORS = ['#3FE8F4', '#9D5CFF', '#E63CD8', '#5B7FFF'];

export function getServiceColor(service: string): string {
  let hash = 0;
  for (let i = 0; i < service.length; i += 1) {
    hash = service.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SERVICE_COLORS[Math.abs(hash) % SERVICE_COLORS.length];
}

export function formatLeadDate(
  isoDate: string,
  locale: 'fa' | 'en'
): string {
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export function truncateMessage(message: string, max = 60): string {
  if (message.length <= max) return message;
  return `${message.slice(0, max).trim()}…`;
}

export function exportLeadsToCsv(leads: Lead[]): void {
  const headers = ['Date', 'Name', 'Company', 'Email', 'Phone', 'Service', 'Message', 'Status', 'Locale'];
  const rows = leads.map(lead => [
    lead.createdAt,
    lead.name,
    lead.companyName || '',
    lead.email,
    lead.phone || '',
    lead.service,
    lead.message.replace(/"/g, '""'),
    lead.status,
    lead.locale,
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hoosh-yar-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export const STATUS_CYCLE: Record<Lead['status'], Lead['status']> = {
  new: 'read',
  read: 'replied',
  replied: 'new',
};
