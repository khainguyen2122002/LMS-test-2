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

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Inspiring HR - Premium LMS",
  description: "Hệ thống quản trị năng lực và phát triển nhân sự toàn diện",
};

// Inner layout that uses client-side providers
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <NotificationProvider>
          <MaintenanceBanner />
          <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
            {/* Fixed Sidebar - 260px */}
            <Sidebar content={dashboardContent.sidebar} />

            {/* Main area - shifts right by sidebar width */}
            <div className="flex-1 ml-[260px]">
              {/* Fixed Top Navbar */}
              <TopNavbar content={dashboardContent.topNav} />

              {/* Scrollable Main Content */}
              <main className="pt-16 pb-12">
                <div className="max-w-[1400px] mx-auto px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Toaster position="bottom-right" richColors theme="system" />
        </NotificationProvider>
      </ThemeProvider>
    </SettingsProvider>
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
      </head>
      <body className={`${inter.variable} antialiased`} style={{ color: 'var(--foreground)', background: 'var(--background)' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
