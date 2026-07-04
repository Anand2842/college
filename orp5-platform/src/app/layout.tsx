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
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
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
            "startDate": "2026-09-21T09:00",
            "endDate": "2026-09-25T17:00",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
              "@type": "Place",
              "name": "NASC Complex",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "NASC Complex, DPS Marg",
                "addressLocality": "New Delhi",
                "addressRegion": "Delhi",
                "postalCode": "110012",
                "addressCountry": "IN"
              }
            },
            "description": "Join ORP-5 for cutting-edge discussions on sustainable organic and natural rice production.",
            "organizer": {
              "@type": "Organization",
              "name": "ORP-5 Conference",
              "url": "https://www.orp5ic.com"
            }
          })}
        </Script>
        <noscript>
          <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',backgroundColor:'#FFFDF7',color:'#2C3333',fontFamily:'Inter, sans-serif',textAlign:'center',padding:'2rem'}}>
            <h1 style={{fontSize:'1.5rem',fontWeight:'bold',marginBottom:'1rem'}}>JavaScript Required</h1>
            <p style={{maxWidth:'28rem',lineHeight:'1.6',color:'#666'}}>
              This website requires JavaScript to function properly. Please enable JavaScript in your browser settings or try a different browser.
            </p>
            <p style={{marginTop:'1.5rem'}}>
              <a href="https://www.orp5ic.com" style={{color:'#1A4D2E',textDecoration:'underline'}}>Return to Homepage</a>
            </p>
          </div>
        </noscript>
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


