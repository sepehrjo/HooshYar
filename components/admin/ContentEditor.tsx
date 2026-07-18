'use client';

import {useEffect, useState} from 'react';
import type {ContentFieldDef} from '@/lib/content/content-tree';
import type {PagesContentData, SiteContentData} from '@/lib/content/utils';
import {getPathValue} from '@/lib/content/utils';
import {useAdminLocale} from '@/hooks/useAdminLocale';

interface ContentEditorProps {
  field: ContentFieldDef | null;
  site: SiteContentData;
  pages: PagesContentData;
  onSave: (fa: string, en: string) => Promise<void>;
  onReset: () => Promise<void>;
  isSaving: boolean;
}

export function ContentEditor({
  field,
  site,
  pages,
  onSave,
  onReset,
  isSaving,
}: ContentEditorProps) {
  const {t, isRTL} = useAdminLocale();
  const [fa, setFa] = useState('');
  const [en, setEn] = useState('');

  useEffect(() => {
    if (!field) {
      setFa('');
      setEn('');
      return;
    }
    const root = field.root === 'site' ? site : pages;
    setFa(getPathValue(root, field.pathFa));
    setEn(getPathValue(root, field.pathEn));
  }, [field, site, pages]);

  if (!field) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.12)] min-h-[400px]">
        <p className="text-[#8A91B0] text-sm">{t('selectSection')}</p>
      </div>
    );
  }

  const isSingle = field.type === 'single';

  return (
    <div
      className="flex-1 flex flex-col bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.12)] overflow-hidden min-h-[400px]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
        <h3 className="text-sm font-semibold text-[#F2F4FF]">
          {isRTL ? field.labelFa : field.labelEn}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isSingle ? (
          <div>
            <label className="block text-xs text-[#8A91B0] mb-2">
              {field.labelEn}
            </label>
            <input
              type="text"
              value={en || fa}
              onChange={e => {
                setEn(e.target.value);
                setFa(e.target.value);
              }}
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-[#F2F4FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#3FE8F4]/50"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#8A91B0] mb-2 font-persian">
                {t('faField')}
              </label>
              <textarea
                value={fa}
                onChange={e => setFa(e.target.value)}
                rows={6}
                dir="rtl"
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-[#F2F4FF] text-sm font-persian focus:outline-none focus:ring-2 focus:ring-[#3FE8F4]/50 resize-y min-h-[120px]"
              />
              <div className="text-xs text-[#8A91B0] mt-1 font-persian">
                {t('characterCount')}: {fa.length}
              </div>
              <div
                className="mt-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-sm font-persian text-[#F2F4FF] whitespace-pre-wrap"
                dir="rtl"
              >
                {fa || '—'}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#8A91B0] mb-2 font-heading">
                {t('enField')}
              </label>
              <textarea
                value={en}
                onChange={e => setEn(e.target.value)}
                rows={6}
                dir="ltr"
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg text-[#F2F4FF] text-sm font-heading focus:outline-none focus:ring-2 focus:ring-[#3FE8F4]/50 resize-y min-h-[120px]"
              />
              <div className="text-xs text-[#8A91B0] mt-1">
                {t('characterCount')}: {en.length}
              </div>
              <div
                className="mt-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-sm font-heading text-[#F2F4FF] whitespace-pre-wrap"
                dir="ltr"
              >
                {en || '—'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.08)] flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => onSave(fa, en)}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#3FE8F4] to-[#E63CD8] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSaving ? t('loading') : t('save')}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={onReset}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#8A91B0] border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)] transition-colors disabled:opacity-50"
        >
          {t('resetToDefault')}
        </button>
      </div>
    </div>
  );
}
