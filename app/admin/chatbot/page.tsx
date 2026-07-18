'use client';

import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import type {ChatSession} from '@/lib/kv';
import type {ChatAnalytics} from '@/app/api/admin/chatbot-logs/route';
import {SessionList} from '@/components/admin/SessionList';
import {ChatLogViewer} from '@/components/admin/ChatLogViewer';
import {ChatEmptyState} from '@/components/admin/ChatEmptyState';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import {useToast} from '@/components/admin/Toast';
import {cn} from '@/lib/utils';

const emptyAnalytics: ChatAnalytics = {
  totalSessions: 0,
  faCount: 0,
  enCount: 0,
  faEnRatio: '0 / 0',
  avgMessagesPerSession: 0,
};

export default function ChatbotLogsPage() {
  const {t, isRTL} = useAdminLocale();
  const {showToast, ToastContainer} = useToast();
  const router = useRouter();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [analytics, setAnalytics] = useState<ChatAnalytics>(emptyAnalytics);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chatbot-logs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSessions(data.sessions ?? []);
      setAnalytics(data.analytics ?? emptyAnalytics);
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    void fetchSessions();
  }, []);

  // Auto-refresh every 30 seconds so new sessions appear without manual reload
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchSessions();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  const markAsRead = async (sessionId: string) => {
    try {
      const res = await fetch('/api/admin/chatbot-logs', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({sessionId, action: 'read'}),
      });
      if (!res.ok) throw new Error('Failed');

      setSessions(prev =>
        prev.map(s =>
          s.sessionId === sessionId ? {...s, read: true} : s
        )
      );
    } catch {
      showToast(t('errorOccurred'), 'error');
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session);
    if (!session.read) {
      markAsRead(session.sessionId);
      setSelectedSession({...session, read: true});
    }
  };

  const handleToggleFlag = async () => {
    if (!selectedSession) return;

    try {
      const res = await fetch('/api/admin/chatbot-logs', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          sessionId: selectedSession.sessionId,
          action: 'toggleFlag',
          flagged: selectedSession.flagged,
        }),
      });

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      const nextFlagged =
        data.session?.flagged ?? data.flagged ?? !selectedSession.flagged;

      setSessions(prev =>
        prev.map(s =>
          s.sessionId === selectedSession.sessionId
            ? {...s, flagged: nextFlagged}
            : s
        )
      );
      setSelectedSession(prev =>
        prev ? {...prev, flagged: nextFlagged} : null
      );
    } catch {
      showToast(t('errorOccurred'), 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ToastContainer />

      {/* Header */}
      <div className={isRTL ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-bold text-[#F2F4FF] mb-2">{t('chatbot')}</h1>
        <p className="text-[#8A91B0]">{t('chatbotSubtitle')}</p>
      </div>

      {/* Analytics Strip */}
      <div className="flex flex-wrap gap-3">
        {[
          {
            label: t('totalSessions'),
            value: analytics.totalSessions,
            color: '#3FE8F4',
          },
          {
            label: t('faEnRatio'),
            value: analytics.faEnRatio,
            color: '#9D5CFF',
          },
          {
            label: t('avgMessagesPerSession'),
            value: analytics.avgMessagesPerSession,
            color: '#E63CD8',
          },
        ].map(pill => (
          <div
            key={pill.label}
            className="px-4 py-2.5 rounded-lg border bg-[rgba(255,255,255,0.04)] backdrop-blur-sm"
            style={{borderColor: `${pill.color}40`}}
          >
            <div className="text-xs text-[#8A91B0] mb-0.5">{pill.label}</div>
            <div className="text-lg font-semibold" style={{color: pill.color}}>
              {pill.value}
            </div>
          </div>
        ))}
      </div>

      {/* Two-Panel Layout */}
      {isLoading ? (
        <div className="text-center py-16 text-[#8A91B0]">{t('loading')}</div>
      ) : sessions.length === 0 ? (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.12)]">
          <ChatEmptyState />
        </div>
      ) : (
        <div
          className={cn(
            'flex gap-0 min-h-[560px]',
            isRTL ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <SessionList
            sessions={sessions}
            selectedId={selectedSession?.sessionId ?? null}
            onSelect={handleSelectSession}
          />
          <ChatLogViewer
            session={selectedSession}
            onToggleFlag={handleToggleFlag}
          />
        </div>
      )}
    </div>
  );
}
