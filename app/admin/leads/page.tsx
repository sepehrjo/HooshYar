'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {Download, Search} from 'lucide-react';
import type {Lead} from '@/lib/kv';
import {LeadsTable, type StatusFilter} from '@/components/admin/LeadsTable';
import {LeadDetailPanel} from '@/components/admin/LeadDetailPanel';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import {exportLeadsToCsv} from '@/lib/admin/leads-utils';
import {useToast} from '@/components/admin/Toast';
import {cn} from '@/lib/utils';

export default function LeadsPage() {
  const {t, isRTL} = useAdminLocale();
  const {showToast, ToastContainer} = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/leads');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    void fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !lead.name.toLowerCase().includes(q) &&
          !lead.email.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      const leadDate = new Date(lead.createdAt);
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (leadDate < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (leadDate > to) return false;
      }

      return true;
    });
  }, [leads, statusFilter, searchQuery, dateFrom, dateTo]);

  const updateLeadStatus = async (
    leadId: string,
    options: {status?: Lead['status']; cycle?: boolean; currentStatus?: Lead['status']},
    silent = false
  ) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: leadId, ...options}),
      });

      if (!res.ok) throw new Error('Failed to update');

      const data = await res.json();
      const nextStatus: Lead['status'] = data.status;

      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId ? {...lead, status: nextStatus} : lead
        )
      );

      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => (prev ? {...prev, status: nextStatus} : null));
      }

      if (!silent) {
        showToast(t('statusUpdated'), 'success');
      }
    } catch {
      showToast(t('errorOccurred'), 'error');
    }
  };

  const handleStatusCycle = (lead: Lead, event: React.MouseEvent) => {
    event.stopPropagation();
    updateLeadStatus(lead.id, {cycle: true, currentStatus: lead.status});
  };

  const handleRowClick = (lead: Lead) => {
    if (lead.status === 'new') {
      setSelectedLead({...lead, status: 'read'});
      updateLeadStatus(lead.id, {status: 'read'}, true);
    } else {
      setSelectedLead(lead);
    }
  };

  const statusFilters: {key: StatusFilter; labelKey: 'filterAll' | 'filterNew' | 'filterRead' | 'filterReplied'}[] = [
    {key: 'all', labelKey: 'filterAll'},
    {key: 'new', labelKey: 'filterNew'},
    {key: 'read', labelKey: 'filterRead'},
    {key: 'replied', labelKey: 'filterReplied'},
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ToastContainer />

      {/* Header */}
      <div
        className={cn(
          'flex flex-wrap items-start justify-between gap-4',
          isRTL ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-[#F2F4FF] mb-2">{t('leads')}</h1>
          <p className="text-[#8A91B0]">{t('leadsSubtitle')}</p>
        </div>

        <button
          type="button"
          onClick={() => exportLeadsToCsv(filteredLeads)}
          disabled={filteredLeads.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] text-[#F2F4FF] hover:bg-[rgba(255,255,255,0.06)] transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {t('exportCsv')}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.12)] p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(({key, labelKey}) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                statusFilter === key
                  ? 'bg-[rgba(63,232,244,0.15)] text-[#3FE8F4] border border-[rgba(63,232,244,0.3)]'
                  : 'text-[#8A91B0] hover:text-[#F2F4FF] hover:bg-[rgba(255,255,255,0.04)]'
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A91B0]',
                isRTL ? 'right-3' : 'left-3'
              )}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className={cn(
                'w-full py-2.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-[#F2F4FF] placeholder-[#8A91B0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3FE8F4]/50 focus:border-[#3FE8F4]',
                isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
              )}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[#8A91B0]">
              <span>{t('dateFrom')}</span>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="py-2 px-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-[#F2F4FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#3FE8F4]/50"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-[#8A91B0]">
              <span>{t('dateTo')}</span>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="py-2 px-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-[#F2F4FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#3FE8F4]/50"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-16 text-[#8A91B0]">{t('loading')}</div>
      ) : filteredLeads.length === 0 && leads.length > 0 ? (
        <div className="text-center py-16 text-[#8A91B0]">{t('noResults')}</div>
      ) : (
        <LeadsTable
          leads={filteredLeads}
          onRowClick={handleRowClick}
          onStatusCycle={handleStatusCycle}
        />
      )}

      {/* Detail Panel */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          isOpen={Boolean(selectedLead)}
          onClose={() => setSelectedLead(null)}
          onStatusChange={status => updateLeadStatus(selectedLead.id, {status})}
        />
      )}
    </div>
  );
}
