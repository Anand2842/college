import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { WhatsAppWidget } from "@/components/atoms/WhatsAppWidget";
import { PromoModal } from "@/components/organisms/PromoModal";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com'),
  title: {
    template: '%s',
    default: '5th International Conference on Organic and Natural Rice Production Systems'
  },
  description: "5th International Conference on Organic and Natural Rice Production Systems",
  verification: {
    google: 'zRwQmTsh44vfMqOPfNQTG9qQ_TUUg9KfSGA3LbXK41A',
    other: {
      'msvalidate.01': '1B0138A031A4AC1559B7B1ABAF852723',
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-516QQW6NKY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-516QQW6NKY');
          `}
        </Script>
        <Script id="event-schema" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "5th International Conference on Organic and Natural Rice Production Systems",
            "startDate": "2026-08-01T09:00",
            "endDate": "2026-08-03T17:00",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
              "@type": "Place",
              "name": "ORP-5 Venue",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "To be announced",
                "addressLocality": "City",
                "addressRegion": "State",
                "postalCode": "00000",
                "addressCountry": "Country"
              }
            },
            "description": "Join ORP-5 for cutting-edge discussions on sustainable organic and natural rice production.",
            "organizer": {
              "@type": "Organization",
              "name": "ORP-5 Organizer",
              "url": "https://www.orp5ic.com"
            }
          })}
        </Script>
        <ErrorBoundary>
          <ClientProviders>
            {children}
            <AdminToolbar />
            <WhatsAppWidget />
            <PromoModal />
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html >
  );
}


