'use client';

import {useCallback, useEffect, useState} from 'react';
import {ExternalLink} from 'lucide-react';
import {ContentTree} from '@/components/admin/ContentTree';
import {ContentEditor} from '@/components/admin/ContentEditor';
import {ChangeHistory} from '@/components/admin/ChangeHistory';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import {useToast} from '@/components/admin/Toast';
import {
  CONTENT_FIELDS,
  type ContentFieldDef,
  type ContentSectionId,
} from '@/lib/content/content-tree';
import type {
  ContentHistoryEntry,
  PagesContentData,
  SiteContentData,
} from '@/lib/content/utils';
import {cn} from '@/lib/utils';

export default function ContentManagerPage() {
  const {t, isRTL} = useAdminLocale();
  const {showToast, ToastContainer} = useToast();

  const [site, setSite] = useState<SiteContentData | null>(null);
  const [pages, setPages] = useState<PagesContentData | null>(null);
  const [history, setHistory] = useState<ContentHistoryEntry[]>([]);
  const [selectedField, setSelectedField] = useState<ContentFieldDef | null>(
    null
  );
  const [expandedSection, setExpandedSection] =
    useState<ContentSectionId | null>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [splitPreview, setSplitPreview] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSite(data.site);
      setPages(data.pages);
      setHistory(data.history ?? []);
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    void fetchContent();
  }, []);

  const handleSave = async (fa: string, en: string) => {
    if (!selectedField) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({fieldId: selectedField.id, fa, en}),
      });
      if (!res.ok) throw new Error('Failed');
      showToast(t('changesSaved'), 'success');
      await fetchContent();
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!selectedField) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({fieldId: selectedField.id}),
      });
      if (!res.ok) throw new Error('Failed');
      showToast(t('changesSaved'), 'success');
      await fetchContent();
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = async (entry: ContentHistoryEntry) => {
    setIsUndoing(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          fieldId: entry.fieldId,
          fa: entry.oldFa,
          en: entry.oldEn,
          undoEntryId: entry.id,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      showToast(t('changesSaved'), 'success');
      await fetchContent();
    } catch {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setIsUndoing(false);
    }
  };

  const toggleSection = (section: ContentSectionId) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  if (isLoading || !site || !pages) {
    return (
      <div className="text-center py-16 text-[#8A91B0]">{t('loading')}</div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      <ToastContainer />

      <div
        className={cn(
          'flex flex-wrap items-start justify-between gap-4',
          isRTL ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-[#F2F4FF] mb-2">
            {t('content')}
          </h1>
          <p className="text-[#8A91B0]">{t('contentSubtitle')}</p>
        </div>

        <button
          type="button"
          onClick={() => setSplitPreview(prev => !prev)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors',
            splitPreview
              ? 'border-[rgba(63,232,244,0.3)] bg-[rgba(63,232,244,0.1)] text-[#3FE8F4]'
              : 'border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] text-[#F2F4FF] hover:bg-[rgba(255,255,255,0.06)]'
          )}
        >
          <ExternalLink className="w-4 h-4" />
          {t('previewSite')}
        </button>
      </div>

      <div
        className={cn(
          'flex gap-4 min-h-[560px]',
          splitPreview ? 'flex-col xl:flex-row' : 'flex-row',
          isRTL && !splitPreview ? 'flex-row-reverse' : ''
        )}
      >
        <div
          className={cn(
            'flex gap-4 flex-1 min-w-0',
            isRTL && !splitPreview ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <ContentTree
            selectedId={selectedField?.id ?? null}
            onSelect={field => {
              setSelectedField(field);
              setExpandedSection(field.section);
            }}
            fields={CONTENT_FIELDS}
            expandedSection={expandedSection}
            onToggleSection={toggleSection}
          />

          <ContentEditor
            field={selectedField}
            site={site}
            pages={pages}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />
        </div>

        {splitPreview && (
          <div className="flex-1 min-h-[400px] xl:min-h-[560px] rounded-xl border border-[rgba(255,255,255,0.12)] overflow-hidden bg-[#05060F]">
            <iframe
              src="/fa"
              title={t('previewSite')}
              className="w-full h-full min-h-[400px]"
            />
          </div>
        )}
      </div>

      <ChangeHistory
        history={history}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(prev => !prev)}
        onUndo={handleUndo}
        isUndoing={isUndoing}
      />
    </div>
  );
}
