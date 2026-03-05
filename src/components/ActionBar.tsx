"use client";

import { useState, useEffect } from "react";
import { Artist } from "@/types";
import { downloadCanvas, shareCanvas } from "@/lib/canvas";
import { generateICS, downloadICS } from "@/lib/ics";

interface ActionBarProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  artists: Artist[];
  selectedIds: string[];
  year: number;
  day: number;
  date: string;
}

export default function ActionBar({
  canvasRef,
  artists,
  selectedIds,
  year,
  day,
}: ActionBarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOSSafari, setIsIOSSafari] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(ua));
    // iOS Safari: 有 Safari 但沒有 CriOS/FxiOS/其他瀏覽器標識
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    setIsIOSSafari(isIOS && /Safari/i.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/i.test(ua));
  }, []);

  const selected = artists
    .filter((a) => selectedIds.includes(a.id))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      await shareCanvas(canvasRef.current, `megaport-${year}-day${day}-lineup.png`);
    } catch {
      // 使用者取消分享
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvas(canvasRef.current, `megaport-${year}-day${day}-lineup.png`);
  };

  const handleExportICS = () => {
    if (selected.length === 0) return;
    const ics = generateICS(selected, `大港開唱 Day${day}`);
    downloadICS(ics, `megaport-${year}-day${day}.ics`);
  };

  const disabled = selected.length === 0;
  const btnSecondary =
    "flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-lg font-bold text-sm hover:bg-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur border-t border-zinc-800 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-50">
      <div className="max-w-2xl mx-auto flex gap-2 justify-center">
        {isMobile && (
          <button
            onClick={handleShare}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享圖片
          </button>
        )}
        <button
          onClick={handleDownload}
          disabled={disabled}
          className={isMobile ? btnSecondary : "flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下載圖片
        </button>
        {(!isMobile || isIOSSafari) && (
          <button
            onClick={handleExportICS}
            disabled={disabled}
            className={btnSecondary}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isMobile ? "加入日曆" : "下載 .ics"}
          </button>
        )}
      </div>
    </div>
  );
}
