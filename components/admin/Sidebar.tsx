'use client';

import {signOut, useSession} from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import {
  LayoutDashboard,
  FileEdit,
  Inbox,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import {useAdminLocale} from '@/hooks/useAdminLocale';
import type {AdminTextKey} from '@/lib/admin-i18n';
import {cn} from '@/lib/utils';

interface NavItem {
  labelKey: AdminTextKey;
  href: string;
  icon: React.ComponentType<{className?: string}>;
}

const navItems: NavItem[] = [
  {labelKey: 'dashboard', href: '/admin', icon: LayoutDashboard},
  {labelKey: 'content', href: '/admin/content', icon: FileEdit},
  {labelKey: 'leads', href: '/admin/leads', icon: Inbox},
  {labelKey: 'chatbot', href: '/admin/chatbot', icon: MessageSquare},
  {labelKey: 'settings', href: '/admin/settings', icon: Settings},
];

export function Sidebar() {
  const pathname = usePathname();
  const {data: session} = useSession();
  const {t, isRTL, locale, setLocale} = useAdminLocale();
  const [unreadLeads, setUnreadLeads] = useState(0);

  useEffect(() => {
    fetch('/api/admin/leads')
      .then(res => (res.ok ? res.json() : {unreadCount: 0}))
      .then(data => setUnreadLeads(data.unreadCount ?? 0))
      .catch(() => setUnreadLeads(0));
  }, [pathname]);

  return (
    <aside
      className={cn(
        'fixed top-0 h-screen w-60 bg-[rgba(255,255,255,0.03)] flex flex-col z-40',
        isRTL ? 'right-0 border-l border-[rgba(255,255,255,0.08)]' : 'left-0 border-r border-[rgba(255,255,255,0.08)]'
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[rgba(63,232,244,0.3)]">
            <Image
              src="/images/Hoosh_Yar_Logo.jpeg"
              alt="Logo"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-sm text-[#8A91B0] font-medium">{t('adminPanel')}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'text-[#3FE8F4] bg-[rgba(63,232,244,0.1)]'
                  : 'text-[#8A91B0] hover:text-[#F2F4FF] hover:bg-[rgba(255,255,255,0.04)]',
                isActive && (isRTL ? 'border-l-[3px] border-l-[#3FE8F4]' : 'border-r-[3px] border-r-[#3FE8F4]')
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{t(item.labelKey)}</span>

              {/* Unread badge for Leads */}
              {item.href === '/admin/leads' && unreadLeads > 0 && (
                <span
                  className={cn(
                    'bg-[rgba(63,232,244,0.15)] text-[#3FE8F4] text-xs px-2 py-0.5 rounded-full',
                    isRTL ? 'mr-auto' : 'ml-auto'
                  )}
                >
                  {unreadLeads}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.08)] space-y-3">
        {/* Username */}
        <div className="px-4 py-2 bg-[rgba(255,255,255,0.04)] rounded-lg">
          <div className="text-xs text-[#8A91B0] mb-1">{t('loggedInAs')}</div>
          <div className="text-sm text-[#F2F4FF] font-medium truncate">
            {session?.user?.name || 'Admin'}
          </div>
        </div>

        {/* Language Toggle — FA / EN pill (public site header style) */}
        <div className="rounded-full border border-glass-border bg-glass-bg p-1 flex">
          <button
            type="button"
            onClick={() => setLocale('fa')}
            className={cn(
              'flex-1 rounded-full px-3 py-2 text-sm font-semibold transition motion-reduce:transition-none',
              locale === 'fa'
                ? 'bg-white/[0.08] text-[#3FE8F4] border border-[rgba(63,232,244,0.3)]'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            FA
          </button>
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={cn(
              'flex-1 rounded-full px-3 py-2 text-sm font-semibold transition motion-reduce:transition-none',
              locale === 'en'
                ? 'bg-white/[0.08] text-[#3FE8F4] border border-[rgba(63,232,244,0.3)]'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            EN
          </button>
        </div>

        {/* Logout Button — use redirect:false then manually redirect to
            avoid NextAuth's detectOrigin() building a localhost URL */}
        <button
          type="button"
          onClick={async () => {
            await signOut({callbackUrl: '/admin/login', redirect: false});
            window.location.href = '/admin/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#8A91B0] hover:text-[#E63CD8] hover:bg-[rgba(230,60,216,0.1)] transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
