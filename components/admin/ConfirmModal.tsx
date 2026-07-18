'use client';

import {AlertTriangle, X} from 'lucide-react';
import {useEffect} from 'react';
import {useAdminLocale} from '@/hooks/useAdminLocale';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  const {t, isRTL} = useAdminLocale();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onCancel();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(5,6,15,0.75)] backdrop-blur-sm"
        onClick={isLoading ? undefined : onCancel}
        aria-label={t('close')}
      />

      <div className="relative w-full max-w-md bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-xl border border-[rgba(255,255,255,0.12)] p-6 shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 end-4 text-[#8A91B0] hover:text-[#F2F4FF] transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[rgba(230,60,216,0.15)] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-[#E63CD8]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#F2F4FF] mb-2">{title}</h3>
            <p className="text-sm text-[#8A91B0] leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-[#8A91B0] hover:text-[#F2F4FF] border border-[rgba(255,255,255,0.12)] rounded-lg transition-colors disabled:opacity-50"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#E63CD8] to-[#9D5CFF] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? t('loading') : (confirmLabel ?? t('confirm'))}
          </button>
        </div>
      </div>
    </div>
  );
}
