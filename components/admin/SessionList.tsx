'use client';

import {Star} from 'lucide-react';
import type {ChatSession} from '@/lib/kv';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import {
  formatRelativeTime,
  getFirstUserMessage,
  getLocaleFlag,
  getMessageCount,
  truncateText,
} from '@/lib/admin/chat-utils';
import {ChatEmptyState} from '@/components/admin/ChatEmptyState';
import {cn} from '@/lib/utils';

interface SessionListProps {
  sessions: ChatSession[];
  selectedId: string | null;
  onSelect: (session: ChatSession) => void;
}

export function SessionList({sessions, selectedId, onSelect}: SessionListProps) {
  const {t, locale, isRTL} = useAdminLocale();

  const timeLabels = {
    justNow: t('justNow'),
    minutesAgo: t('minutesAgo'),
    hoursAgo: t('hoursAgo'),
    daysAgo: t('daysAgo'),
  };

  if (sessions.length === 0) {
    return (
      <div className="w-[300px] flex-shrink-0 border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] rounded-xl overflow-hidden">
        <ChatEmptyState />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-[300px] flex-shrink-0 flex flex-col border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] rounded-xl overflow-hidden',
        isRTL ? 'border-l' : 'border-r'
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
        <h3 className="text-sm font-semibold text-[#F2F4FF]">{t('sessions')}</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.map(session => {
          const isSelected = selectedId === session.sessionId;
          const isUnread = !session.read;
          const preview = truncateText(getFirstUserMessage(session));
          const msgCount = getMessageCount(session);

          return (
            <button
              key={session.sessionId}
              type="button"
              onClick={() => onSelect(session)}
              className={cn(
                'w-full text-start px-4 py-3 border-b border-[rgba(255,255,255,0.06)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.04)]',
                isSelected && 'bg-[rgba(63,232,244,0.08)]',
                isUnread &&
                  (isRTL
                    ? 'border-r-[3px] border-r-[#3FE8F4]'
                    : 'border-l-[3px] border-l-[#3FE8F4]')
              )}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">
                  {getLocaleFlag(session.locale)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F2F4FF] truncate mb-1">
                    {preview || '—'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#8A91B0]">
                    <span>
                      {msgCount} {t('messages')}
                    </span>
                    <span>·</span>
                    <span>
                      {formatRelativeTime(
                        session.lastActivityAt,
                        locale,
                        timeLabels
                      )}
                    </span>
                  </div>
                </div>
                {session.flagged && (
                  <Star
                    className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
