'use client';

import {AlertTriangle} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useAdminLocale} from '@/hooks/useAdminLocale';

export function DemoModeBanner() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {t, isRTL} = useAdminLocale();

  const fetchDemoMode = () => {
    fetch('/api/admin/demo-mode')
      .then(res => res.json())
      .then(data => {
        setIsDemoMode(data.enabled || false);
      })
      .catch(() => {
        setIsDemoMode(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDemoMode();

    const handleChange = () => fetchDemoMode();
    window.addEventListener('demo-mode-changed', handleChange);
    return () => window.removeEventListener('demo-mode-changed', handleChange);
  }, []);

  if (isLoading || !isDemoMode) {
    return null;
  }

  return (
    <div className="w-full bg-[rgba(255,140,0,0.15)] border-b border-[rgba(255,140,0,0.3)] px-6 py-3">
      <div
        className="flex items-center justify-center gap-3 text-orange-400"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{t('demoModeActive')}</span>
      </div>
    </div>
  );
}
