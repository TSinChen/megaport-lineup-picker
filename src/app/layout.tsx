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
  title: "大港開唱 選團器",
  description: "在 lineup 圖上圈選你想看的藝人，完成後分享給朋友",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🟠</text></svg>",
  },
  openGraph: {
    title: "大港開唱 選團器",
    description: "在 lineup 圖上圈選你想看的藝人，完成後分享給朋友",
    type: "website",
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
