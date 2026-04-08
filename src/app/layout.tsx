import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { ThemeProvider, ThemeScript } from "@/components/theme/ThemeProvider";
import { dashboardContent } from "@/lib/content";
import { Toaster } from 'sonner'
import { SettingsProvider } from '@/components/settings/SettingsProvider'
import { MaintenanceBanner } from '@/components/settings/MaintenanceBanner'
import { UserProvider } from '@/components/users/UserProvider'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Inspiring HR - Premium LMS",
  description: "Hệ thống quản trị năng lực và phát triển nhân sự toàn diện",
};

import QueryProvider from '@/components/providers/QueryProvider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { LayoutWrapper } from '@/components/layout/LayoutWrapper'

// Inner layout that uses client-side providers
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SettingsProvider>
        <AuthProvider>
          <ThemeProvider>
            <UserProvider>
            <NotificationProvider>
              <MaintenanceBanner />
              <LayoutWrapper sidebarContent={dashboardContent.sidebar} topNavContent={dashboardContent.topNav}>
                {children}
              </LayoutWrapper>
              <Toaster position="bottom-right" richColors theme="system" />
            </NotificationProvider>
          </UserProvider>
        </ThemeProvider>
      </AuthProvider>
    </SettingsProvider>
  </QueryProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Inline script prevents flash of wrong theme before React hydrates */}
        <ThemeScript />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} antialiased`} style={{ color: 'var(--foreground)', background: 'var(--background)' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
