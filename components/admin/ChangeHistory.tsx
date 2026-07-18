'use client';

import {ChevronDown, ChevronUp, RotateCcw} from 'lucide-react';
import type {ContentHistoryEntry} from '@/lib/content/utils';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import {formatLeadDate} from '@/lib/admin/leads-utils';
import {cn} from '@/lib/utils';

interface ChangeHistoryProps {
  history: ContentHistoryEntry[];
  isOpen: boolean;
  onToggle: () => void;
  onUndo: (entry: ContentHistoryEntry) => void;
  isUndoing: boolean;
}

export function ChangeHistory({
  history,
  isOpen,
  onToggle,
  onUndo,
  isUndoing,
}: ChangeHistoryProps) {
  const {t, locale, isRTL} = useAdminLocale();

  if (history.length === 0) return null;

  return (
    <div
      className="rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#F2F4FF] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
      >
        <span>
          {t('changeHistory')} ({history.length})
        </span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-[#8A91B0]" />
        ) : (
          <ChevronUp className="w-4 h-4 text-[#8A91B0]" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-[rgba(255,255,255,0.08)] max-h-48 overflow-y-auto">
          {history.map(entry => (
            <div
              key={entry.id}
              className="flex items-start gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#F2F4FF] truncate">
                  {entry.fieldLabel}
                </div>
                <div className="text-xs text-[#8A91B0] mt-0.5">
                  {formatLeadDate(entry.timestamp, locale)}
                </div>
              </div>
              <button
                type="button"
                disabled={isUndoing}
                onClick={() => onUndo(entry)}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded text-xs text-[#9D5CFF] hover:bg-[rgba(157,92,255,0.1)] transition-colors disabled:opacity-50'
                )}
              >
                <RotateCcw className="w-3 h-3" />
                {t('undo')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
