'use client';

import type {Lead} from '@/lib/kv';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import type {AdminTextKey} from '@/lib/admin-i18n';
import {
  formatLeadDate,
  getServiceColor,
  truncateMessage,
} from '@/lib/admin/leads-utils';
import {LeadsEmptyState} from '@/components/admin/LeadsEmptyState';
import {cn} from '@/lib/utils';

interface LeadsTableProps {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
  onStatusCycle: (lead: Lead, event: React.MouseEvent) => void;
}

type StatusFilter = 'all' | Lead['status'];

const statusStyles: Record<
  Lead['status'],
  {bg: string; text: string; labelKey: AdminTextKey}
> = {
  new: {bg: 'rgba(63, 232, 244, 0.15)', text: '#3FE8F4', labelKey: 'statusNew'},
  read: {bg: 'rgba(138, 145, 176, 0.15)', text: '#8A91B0', labelKey: 'statusRead'},
  replied: {
    bg: 'rgba(157, 92, 255, 0.15)',
    text: '#9D5CFF',
    labelKey: 'statusReplied',
  },
};

export function LeadsTable({leads, onRowClick, onStatusCycle}: LeadsTableProps) {
  const {t, locale, isRTL} = useAdminLocale();

  if (leads.length === 0) {
    return <LeadsEmptyState />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.12)]">
      <table className="w-full text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
        <thead>
          <tr className="bg-[rgba(255,255,255,0.06)] text-[#8A91B0] font-semibold">
            <th className="px-4 py-3 text-start">{t('date')}</th>
            <th className="px-4 py-3 text-start">{t('name')}</th>
            <th className="px-4 py-3 text-start">{t('company')}</th>
            <th className="px-4 py-3 text-start">{t('email')}</th>
            <th className="px-4 py-3 text-start">{t('phone')}</th>
            <th className="px-4 py-3 text-start">{t('service')}</th>
            <th className="px-4 py-3 text-start">{t('messagePreview')}</th>
            <th className="px-4 py-3 text-start">{t('status')}</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => {
            const serviceColor = getServiceColor(lead.service);
            const statusStyle = statusStyles[lead.status];

            return (
              <tr
                key={lead.id}
                onClick={() => onRowClick(lead)}
                className={cn(
                  'cursor-pointer transition-colors duration-150 hover:bg-[rgba(255,255,255,0.04)] border-t border-[rgba(255,255,255,0.06)]',
                  index % 2 === 1 && 'bg-[rgba(255,255,255,0.02)]'
                )}
              >
                <td className="px-4 py-3 text-[#8A91B0] whitespace-nowrap">
                  {formatLeadDate(lead.createdAt, locale)}
                </td>
                <td className="px-4 py-3 text-[#F2F4FF] font-medium">
                  <div className="flex items-center gap-2">
                    {lead.status === 'new' && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#3FE8F4] flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {lead.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#8A91B0]">
                  {lead.companyName || '—'}
                </td>
                <td className="px-4 py-3">
                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      onClick={e => e.stopPropagation()}
                      className="text-[#3FE8F4] hover:underline"
                    >
                      {lead.email}
                    </a>
                  ) : (
                    <span className="text-[#8A91B0]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#8A91B0]">
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      onClick={e => e.stopPropagation()}
                      className="text-[#3FE8F4] hover:underline"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded whitespace-nowrap"
                    style={{
                      backgroundColor: `${serviceColor}20`,
                      color: serviceColor,
                    }}
                  >
                    {lead.service}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#8A91B0] max-w-[200px] truncate">
                  {truncateMessage(lead.message)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={e => onStatusCycle(lead, e)}
                    className="text-xs px-2.5 py-1 rounded-full font-medium transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                    }}
                  >
                    {t(statusStyle.labelKey)}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export type {StatusFilter};
