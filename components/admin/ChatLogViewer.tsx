'use client';

import Image from 'next/image';
import {Star} from 'lucide-react';
import type {ChatSession} from '@/lib/kv';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import {formatMessageTime, getLocaleFlag} from '@/lib/admin/chat-utils';
import {cn} from '@/lib/utils';

interface ChatLogViewerProps {
  session: ChatSession | null;
  onToggleFlag: () => void;
}

export function ChatLogViewer({session, onToggleFlag}: ChatLogViewerProps) {
  const {t} = useAdminLocale();

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.12)]">
        <p className="text-[#8A91B0] text-sm">{t('noSessionSelected')}</p>
      </div>
    );
  }

  const sessionRTL = session.locale === 'fa';

  return (
    <div
      className="flex-1 flex flex-col bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.12)] overflow-hidden min-h-[500px]"
      dir={sessionRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getLocaleFlag(session.locale)}</span>
          <span className="text-sm font-medium text-[#F2F4FF]">
            {t('conversation')}
          </span>
          <span className="text-xs text-[#8A91B0]">
            ({session.messages.filter(m => m.role === 'user').length}{' '}
            {t('messages')})
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          className={cn(
            'p-2 rounded-lg transition-colors',
            session.flagged
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-[#8A91B0] hover:text-yellow-400'
          )}
          aria-label={session.flagged ? t('unflagSession') : t('flagSession')}
          title={session.flagged ? t('unflagSession') : t('flagSession')}
        >
          <Star
            className={cn('w-5 h-5', session.flagged && 'fill-yellow-400')}
          />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {session.messages.map((message, index) => {
          const isBot = message.role === 'assistant';

          return (
            <div key={`${message.timestamp}-${index}`} className="space-y-1">
              <div
                className={cn(
                  'flex items-start gap-2',
                  isBot
                    ? sessionRTL
                      ? 'flex-row-reverse'
                      : 'flex-row'
                    : sessionRTL
                      ? 'flex-row'
                      : 'flex-row-reverse'
                )}
              >
                {isBot && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/chatbot.png"
                      alt="Bot"
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[75%] px-4 py-2.5 text-sm whitespace-pre-wrap',
                    isBot
                      ? 'bg-[rgba(255,255,255,0.06)] text-[#F2F4FF]'
                      : 'bg-gradient-to-br from-[rgba(63,232,244,0.12)] to-[rgba(157,92,255,0.12)] border border-[rgba(157,92,255,0.25)] text-[#F2F4FF]'
                  )}
                  style={{
                    borderRadius: isBot
                      ? sessionRTL
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px'
                      : sessionRTL
                        ? '16px 16px 16px 4px'
                        : '16px 16px 4px 16px',
                  }}
                >
                  {message.content}
                </div>
              </div>

              <div
                className={cn(
                  'text-[10px] text-[#8A91B0] px-1',
                  isBot
                    ? sessionRTL
                      ? 'text-right pr-8'
                      : 'text-left pl-8'
                    : sessionRTL
                      ? 'text-left pl-2'
                      : 'text-right pr-2'
                )}
              >
                {formatMessageTime(message.timestamp, session.locale as 'fa' | 'en')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
