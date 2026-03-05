import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "大港開唱 選團器",
  description: "在 lineup 圖上圈選你想看的藝人，下載圖片分享或匯出行程日曆",
  openGraph: {
    title: "大港開唱 選團器",
    description: "在 lineup 圖上圈選你想看的藝人，下載圖片分享或匯出行程日曆",
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
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
