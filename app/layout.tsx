import { Nunito, Rhodium_Libre, Metrophobic } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: 'swap',
  preload: true,
});

const rhodiumLibre = Rhodium_Libre({
  variable: "--font-rhodium-libre",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
  preload: true,
});

const metrophobic = Metrophobic({
  variable: "--font-metrophobic",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
  preload: true,
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Grains gold" />

      </head>
      <body
        className={`${nunito.variable} ${rhodiumLibre.variable} ${metrophobic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}