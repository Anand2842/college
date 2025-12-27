import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { ClientProviders } from "@/components/providers/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5.org'),
  title: {
    template: '%s | ORP-5',
    default: '5th International Conference on Organic and Natural Rice Production Systems'
  },
  description: "5th International Conference on Organic and Natural Rice Production Systems",
  verification: {
    google: 'zRwQmTsh44vfMqOPfNQTG9qQ_TUUg9KfSGA3LbXK41A',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          merriweather.variable
        )}
      >
        <ErrorBoundary>
          <ClientProviders>
            {children}
            <AdminToolbar />
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
