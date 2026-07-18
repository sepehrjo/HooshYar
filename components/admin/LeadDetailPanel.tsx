'use client';

import {Mail, X} from 'lucide-react';
import type {Lead} from '@/lib/kv';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import {
  formatLeadDate,
  getServiceColor,
} from '@/lib/admin/leads-utils';
import {cn} from '@/lib/utils';

interface LeadDetailPanelProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: Lead['status']) => void;
}

const statusStyles: Record<
  Lead['status'],
  {bg: string; text: string; labelKey: 'statusNew' | 'statusRead' | 'statusReplied'}
> = {
  new: {
    bg: 'rgba(63, 232, 244, 0.15)',
    text: '#3FE8F4',
    labelKey: 'statusNew',
  },
  read: {
    bg: 'rgba(138, 145, 176, 0.15)',
    text: '#8A91B0',
    labelKey: 'statusRead',
  },
  replied: {
    bg: 'rgba(157, 92, 255, 0.15)',
    text: '#9D5CFF',
    labelKey: 'statusReplied',
  },
};

export function LeadDetailPanel({
  lead,
  isOpen,
  onClose,
  onStatusChange,
}: LeadDetailPanelProps) {
  const {t, isRTL, locale} = useAdminLocale();
  const serviceColor = getServiceColor(lead.service);
  const statusStyle = statusStyles[lead.status];

  const mailtoSubject = encodeURIComponent(
    locale === 'fa'
      ? `پاسخ به درخواست: ${lead.service}`
      : `Re: ${lead.service} inquiry`
  );
  const mailtoBody = encodeURIComponent(
    locale === 'fa'
      ? `سلام ${lead.name}،\n\n`
      : `Hi ${lead.name},\n\n`
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={cn(
          'fixed top-0 h-full w-full max-w-md bg-[#05060F] border-[rgba(255,255,255,0.12)] z-50 flex flex-col transition-transform duration-300 ease-out',
          isRTL ? 'left-0 border-r' : 'right-0 border-l',
          isOpen
            ? 'translate-x-0'
            : isRTL
              ? '-translate-x-full'
              : 'translate-x-full'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
        role="dialog"
        aria-modal="true"
        aria-label={t('leadDetails')}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.08)]">
          <h2 className="text-lg font-semibold text-[#F2F4FF]">{t('leadDetails')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#8A91B0] hover:text-[#F2F4FF] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <div className="text-xs text-[#8A91B0] mb-1">{t('date')}</div>
            <div className="text-sm text-[#F2F4FF]">
              {formatLeadDate(lead.createdAt, locale)}
            </div>
          </div>

          <div>
            <div className="text-xs text-[#8A91B0] mb-1">{t('name')}</div>
            <div className="text-sm text-[#F2F4FF] font-medium">{lead.name}</div>
          </div>

          {lead.companyName && (
            <div>
              <div className="text-xs text-[#8A91B0] mb-1">{t('company')}</div>
              <div className="text-sm text-[#F2F4FF]">{lead.companyName}</div>
            </div>
          )}

          {lead.email && (
            <div>
              <div className="text-xs text-[#8A91B0] mb-1">{t('email')}</div>
              <a
                href={`mailto:${lead.email}`}
                className="text-sm text-[#3FE8F4] hover:underline"
              >
                {lead.email}
              </a>
            </div>
          )}

          {lead.phone && (
            <div>
              <div className="text-xs text-[#8A91B0] mb-1">{t('phone')}</div>
              <a
                href={`tel:${lead.phone}`}
                className="text-sm text-[#3FE8F4] hover:underline"
              >
                {lead.phone}
              </a>
            </div>
          )}

          <div>
            <div className="text-xs text-[#8A91B0] mb-1">{t('service')}</div>
            <span
              className="text-xs px-2 py-1 rounded inline-block"
              style={{
                backgroundColor: `${serviceColor}20`,
                color: serviceColor,
              }}
            >
              {lead.service}
            </span>
          </div>

          <div>
            <div className="text-xs text-[#8A91B0] mb-1">{t('localeLabel')}</div>
            <div className="text-sm text-[#F2F4FF]">
              {lead.locale === 'fa' ? '🇮🇷 FA' : '🇬🇧 EN'}
            </div>
          </div>

          <div>
            <div className="text-xs text-[#8A91B0] mb-1">{t('status')}</div>
            <span
              className="text-xs px-2 py-1 rounded-full inline-block font-medium"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
              }}
            >
              {t(statusStyle.labelKey)}
            </span>
          </div>

          <div>
            <div className="text-xs text-[#8A91B0] mb-2">{t('message')}</div>
            <div className="text-sm text-[#F2F4FF] leading-relaxed whitespace-pre-wrap bg-[rgba(255,255,255,0.02)] rounded-lg p-4 border border-[rgba(255,255,255,0.08)]">
              {lead.message}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-[rgba(255,255,255,0.08)] space-y-3">
          {lead.email && (
            <a
              href={`mailto:${lead.email}?subject=${mailtoSubject}&body=${mailtoBody}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[rgba(63,232,244,0.1)] border border-[rgba(63,232,244,0.3)] text-[#3FE8F4] hover:bg-[rgba(63,232,244,0.15)] transition-colors text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              {t('reply')}
            </a>
          )}

          <div className="flex gap-2">
            {lead.status !== 'read' && (
              <button
                type="button"
                onClick={() => onStatusChange('read')}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-[#8A91B0] border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              >
                {t('markAsRead')}
              </button>
            )}
            {lead.status !== 'replied' && (
              <button
                type="button"
                onClick={() => onStatusChange('replied')}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-[#9D5CFF] border border-[rgba(157,92,255,0.3)] hover:bg-[rgba(157,92,255,0.1)] transition-colors"
              >
                {t('markAsReplied')}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
