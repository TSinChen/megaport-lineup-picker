import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://megaport-lineup-picker.com"),
  title: "大港開唱 選團器",
  description: "點擊圖片上的藝人來標記，讓大家知道你想聽什麼",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "大港開唱 選團器",
    description: "點擊圖片上的藝人來標記，讓大家知道你想聽什麼",
    type: "website",
    url: "https://megaport-lineup-picker.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="bg-black text-white min-h-screen antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
        {process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId="G-RB4LPHTNH5" />
        )}
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
