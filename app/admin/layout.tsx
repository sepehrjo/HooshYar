'use client';

import {SessionProvider} from 'next-auth/react';
import {Space_Grotesk, Vazirmatn} from 'next/font/google';
import {ReactNode} from 'react';
import '@/app/globals.css';
import {Sidebar} from '@/components/admin/Sidebar';
import {DemoModeBanner} from '@/components/admin/DemoModeBanner';
import {usePathname} from 'next/navigation';
import {AdminLocaleProvider, useAdminLocale} from '@/hooks/useAdminLocale';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-persian',
  display: 'swap',
});

function AdminLayoutContent({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const {isRTL, isHydrated, locale} = useAdminLocale();

  const sidebarOffset = isRTL ? 'mr-60' : 'ml-60';
  const fontClass = isRTL ? 'font-persian' : 'font-heading';

  if (!isHydrated && !isLoginPage) {
    return (
      <div className="flex min-h-screen" dir="rtl">
        <Sidebar />
        <div className={`flex-1 mr-60 ${fontClass}`}>
          <DemoModeBanner />
          <main className="p-8">{children}</main>
        </div>
      </div>
    );
  }

  return isLoginPage ? (
    children
  ) : (
    <div
      className="flex min-h-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={locale}
    >
      <Sidebar />
      <div className={`flex-1 ${sidebarOffset} ${fontClass}`}>
        <DemoModeBanner />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({children}: {children: ReactNode}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${spaceGrotesk.variable} ${vazirmatn.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <SessionProvider>
          <AdminLocaleProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
          </AdminLocaleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
