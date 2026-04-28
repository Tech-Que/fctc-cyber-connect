import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import { getCurrentUser } from "@/lib/auth/session";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "FCTC Cyber Connect",
  description:
    "Cybersecurity program community for First Coast Technical College students and alumni",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FCTC Cyber Connect",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1D34" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Inline, synchronous theme init. Runs before React hydrates, so users who
// previously chose dark mode don't see a light-mode flash on reload.
const themeInitScript = `(function(){try{var s=localStorage.getItem('fctc-theme');if(s==='dark')document.documentElement.classList.add('dark');else if(s==='light')document.documentElement.classList.remove('dark');}catch(e){}})();`;

// Manual service-worker registration. next-pwa@5.6.0's auto-inject was built
// for Pages Router and doesn't add a registration script to App Router HTML,
// so we register it ourselves. Eagerly (no load-event wait) so the SW has the
// longest possible runway to install + activate + claim before Lighthouse
// measures controllerness; the SW spec defers actual install work to be
// non-blocking, so we don't pay a TTFB penalty for this.
const swRegisterScript = `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(function(e){console.error('SW registration failed:',e)})}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: swRegisterScript }} />
      </head>
      <body className="antialiased">
        <Shell user={user}>{children}</Shell>
      </body>
    </html>
  );
}
