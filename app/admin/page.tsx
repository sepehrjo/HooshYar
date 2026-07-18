'use client';

import {useCallback, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {redirect} from 'next/navigation';
import {StatCard} from '@/components/admin/StatCard';
import {
  Inbox,
  MessageSquare,
  Users,
  Clock,
  ExternalLink,
  ToggleLeft,
} from 'lucide-react';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import type {Lead, ChatSession} from '@/lib/kv';

interface DashboardData {
  newLeadsToday: number;
  totalLeads: number;
  chatSessionsToday: number;
  lastUpdate: string | null;
  recentLeads: Lead[];
  recentChats: ChatSession[];
}

export default function AdminDashboard() {
  const {data: session, status} = useSession();
  const {t, isRTL} = useAdminLocale();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const [leadsRes, chatsRes] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/admin/chatbot-logs'),
      ]);

      const leadsData = leadsRes.ok ? await leadsRes.json() : {leads: []};
      const chatsData = chatsRes.ok ? await chatsRes.json() : {sessions: []};

      const allLeads: Lead[] = leadsData.leads ?? [];
      const allChats: ChatSession[] = chatsData.sessions ?? [];

      const today = new Date().toDateString();
      const newLeadsToday = allLeads.filter(
        l => new Date(l.createdAt).toDateString() === today
      ).length;
      const chatSessionsToday = allChats.filter(
        s => new Date(s.lastActivityAt || s.createdAt).toDateString() === today
      ).length;

      const recentLeads = [...allLeads]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      const recentChats = [...allChats]
        .sort((a, b) => new Date(b.lastActivityAt || b.createdAt).getTime() - new Date(a.lastActivityAt || a.createdAt).getTime())
        .slice(0, 3);

      // Try to get last content update from settings
      let lastUpdate: string | null = null;
      try {
        const settingsRes = await fetch('/api/admin/settings');
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          // The settings API doesn't return lastModified directly,
          // but the content API does
        }
      } catch {}

      try {
        const contentRes = await fetch('/api/admin/content');
        if (contentRes.ok) {
          const contentData = await contentRes.json();
          lastUpdate = contentData.lastModified ?? null;
        }
      } catch {}

      setData({
        newLeadsToday,
        totalLeads: allLeads.length,
        chatSessionsToday,
        lastUpdate,
        recentLeads,
        recentChats,
      });
    } catch {
      setData({
        newLeadsToday: 0,
        totalLeads: 0,
        chatSessionsToday: 0,
        lastUpdate: null,
        recentLeads: [],
        recentChats: [],
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#8A91B0]">{t('loading')}</div>
      </div>
    );
  }

  if (!session) {
    redirect('/admin/login');
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#8A91B0]">{t('loading')}</div>
      </div>
    );
  }

  // Format relative time
  const formatRelativeTime = (iso: string | null): string => {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) {
      const mins = Math.floor(diff / (1000 * 60));
      return isRTL ? `${mins} ${t('minutesAgo')}` : `${mins} ${t('minutesAgo')}`;
    }
    if (hours < 24) {
      return isRTL ? `${hours} ${t('hoursAgo')}` : `${hours} ${t('hoursAgo')}`;
    }
    const days = Math.floor(hours / 24);
    return isRTL ? `${days} ${t('daysAgo')}` : `${days} ${t('daysAgo')}`;
  };

  const serviceColors: Record<string, string> = {
    'AI Services': '#3FE8F4',
    'AI Automation': '#3FE8F4',
    'Automation': '#9D5CFF',
    'Web Development': '#9D5CFF',
    'Chatbot Development': '#E63CD8',
    'Custom / Not sure': '#8A91B0',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className={isRTL ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-bold text-[#F2F4FF] mb-2">{t('dashboard')}</h1>
        <p className="text-[#8A91B0]">{t('dashboardSubtitle')}</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('newLeadsToday')}
          value={String(data.newLeadsToday)}
          icon={Inbox}
          accent="cyan"
          subtitle={t('today')}
        />
        <StatCard
          title={t('totalLeads')}
          value={String(data.totalLeads)}
          icon={Users}
          accent="violet"
          subtitle={t('allTime')}
        />
        <StatCard
          title={t('chatSessionsToday')}
          value={String(data.chatSessionsToday)}
          icon={MessageSquare}
          accent="magenta"
          subtitle={t('today')}
        />
        <StatCard
          title={t('lastUpdate')}
          value={formatRelativeTime(data.lastUpdate)}
          icon={Clock}
          accent="muted"
          subtitle={data.lastUpdate ? t('ago') : '—'}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.12)] p-6">
          <h3 className="text-lg font-semibold text-[#F2F4FF] mb-4 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-[#3FE8F4]" />
            {t('recentLeads')}
          </h3>

          <div className="space-y-3">
            {data.recentLeads.length > 0 ? (
              data.recentLeads.map((lead) => {
                const color = serviceColors[lead.service] || '#3FE8F4';
                const leadTime = new Date(lead.createdAt);
                const timeStr = isRTL
                  ? leadTime.toLocaleDateString('fa-IR')
                  : leadTime.toLocaleDateString();
                return (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.02)] rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#F2F4FF] mb-1">
                        {lead.name}
                      </div>
                      <div
                        className="text-xs px-2 py-0.5 rounded inline-block"
                        style={{
                          backgroundColor: `${color}20`,
                          color,
                        }}
                      >
                        {lead.service}
                      </div>
                    </div>
                    <div className="text-xs text-[#8A91B0]">{timeStr}</div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-[#8A91B0]">{t('noLeads')}</div>
            )}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-[#3FE8F4] hover:text-[#F2F4FF] transition-colors">
            {t('viewAllLeads')}
          </button>
        </div>

        {/* Recent Chatbot Sessions */}
        <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.12)] p-6">
          <h3 className="text-lg font-semibold text-[#F2F4FF] mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#E63CD8]" />
            {t('recentChats')}
          </h3>

          <div className="space-y-3">
            {data.recentChats.length > 0 ? (
              data.recentChats.map((chat) => {
                const flag = chat.locale === 'fa' ? '🇮🇷' : '🇬🇧';
                const chatTime = new Date(chat.lastActivityAt || chat.createdAt);
                const timeStr = isRTL
                  ? chatTime.toLocaleDateString('fa-IR')
                  : chatTime.toLocaleDateString();
                return (
                  <div
                    key={chat.id}
                    className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.02)] rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{flag}</span>
                      <div>
                        <div className="text-sm text-[#F2F4FF]">
                          {chat.messages.length} {t('messages')}
                        </div>
                        <div className="text-xs text-[#8A91B0]">{timeStr}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-[#8A91B0]">{t('noChats')}</div>
            )}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-[#E63CD8] hover:text-[#F2F4FF] transition-colors">
            {t('viewAllSessions')}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <a
          href="/fa"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-[rgba(63,232,244,0.1)] border border-[rgba(63,232,244,0.3)] rounded-lg text-[#3FE8F4] hover:bg-[rgba(63,232,244,0.15)] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="text-sm font-medium">{t('viewSite')}</span>
        </a>

        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 bg-[rgba(157,92,255,0.1)] border border-[rgba(157,92,255,0.3)] rounded-lg text-[#9D5CFF] hover:bg-[rgba(157,92,255,0.15)] transition-colors"
        >
          <ToggleLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t('toggleDemo')}</span>
        </button>
      </div>
    </div>
  );
}
