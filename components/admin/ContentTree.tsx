'use client';

import type {ContentFieldDef, ContentSectionId} from '@/lib/content/content-tree';
import {CONTENT_SECTIONS} from '@/lib/content/content-tree';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import {cn} from '@/lib/utils';

interface ContentTreeProps {
  selectedId: string | null;
  onSelect: (field: ContentFieldDef) => void;
  fields: ContentFieldDef[];
  expandedSection: ContentSectionId | null;
  onToggleSection: (section: ContentSectionId) => void;
}

export function ContentTree({
  selectedId,
  onSelect,
  fields,
  expandedSection,
  onToggleSection,
}: ContentTreeProps) {
  const {t, isRTL, locale} = useAdminLocale();

  return (
    <div
      className="w-[280px] flex-shrink-0 flex flex-col border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] rounded-xl overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
        <h3 className="text-sm font-semibold text-[#F2F4FF]">
          {t('contentSections')}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {CONTENT_SECTIONS.map(section => {
          const sectionFields = fields.filter(f => f.section === section.id);
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id}>
              <button
                type="button"
                onClick={() => onToggleSection(section.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#F2F4FF] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              >
                <span>{section.emoji}</span>
                <span className="flex-1 text-start">{t(section.labelKey)}</span>
                <span className="text-[#8A91B0] text-xs">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-2 mr-2 space-y-0.5 pb-2">
                  {sectionFields.map(field => (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => onSelect(field)}
                      className={cn(
                        'w-full text-start px-3 py-2 rounded-lg text-xs transition-colors truncate',
                        selectedId === field.id
                          ? 'bg-[rgba(63,232,244,0.12)] text-[#3FE8F4]'
                          : 'text-[#8A91B0] hover:text-[#F2F4FF] hover:bg-[rgba(255,255,255,0.03)]'
                      )}
                    >
                      {locale === 'fa' ? field.labelFa : field.labelEn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
