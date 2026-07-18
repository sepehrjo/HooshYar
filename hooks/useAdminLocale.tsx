'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {adminText, type AdminLocale, type AdminTextKey} from '@/lib/admin-i18n';

const STORAGE_KEY = 'admin-locale';
const DEFAULT_LOCALE: AdminLocale = 'fa';

interface AdminLocaleContextValue {
  locale: AdminLocale;
  t: (key: AdminTextKey) => string;
  setLocale: (locale: AdminLocale) => void;
  toggleLocale: () => void;
  isRTL: boolean;
  isHydrated: boolean;
}

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

export function AdminLocaleProvider({children}: {children: ReactNode}) {
  const [locale, setLocaleState] = useState<AdminLocale>(DEFAULT_LOCALE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AdminLocale | null;
    if (stored === 'fa' || stored === 'en') {
      setLocaleState(stored);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [isHydrated, locale]);

  const setLocale = useCallback((next: AdminLocale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState(prev => (prev === 'fa' ? 'en' : 'fa'));
  }, []);

  const t = useCallback(
    (key: AdminTextKey): string => {
      return adminText[locale][key];
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      t,
      setLocale,
      toggleLocale,
      isRTL: locale === 'fa',
      isHydrated,
    }),
    [locale, t, setLocale, toggleLocale, isHydrated]
  );

  return (
    <AdminLocaleContext.Provider value={value}>
      {children}
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  const context = useContext(AdminLocaleContext);
  if (!context) {
    throw new Error('useAdminLocale must be used within AdminLocaleProvider');
  }
  return context;
}
