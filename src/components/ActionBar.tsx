"use client";

import { Artist } from "@/types";
import { downloadCanvas } from "@/lib/canvas";
import { generateICS, downloadICS } from "@/lib/ics";
import { formatTime } from "@/lib/format";
import { toast } from "sonner";

interface ActionBarProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  artists: Artist[];
  selectedIds: string[];
  day: number;
  date: string;
}

export default function ActionBar({
  canvasRef,
  artists,
  selectedIds,
  day,
  date,
}: ActionBarProps) {
  const selected = artists
    .filter((a) => selectedIds.includes(a.id))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const handleDownloadImage = async () => {
    if (canvasRef.current) {
      await downloadCanvas(canvasRef.current, `megaport-day${day}-lineup.png`);
    }
  };

  const handleCopySchedule = async () => {
    if (selected.length === 0) return;

    const dateStr = `${parseInt(date.split("-")[1])}/${parseInt(date.split("-")[2])}`;
    let text = `🎵 我的大港開唱行程\nDay${day} (${dateStr})\n`;
    text += selected
      .map((a) => `${formatTime(a.startTime)} ${a.stage} - ${a.name}`)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("已複製到剪貼簿！");
    } catch {
      toast.error("無法複製，請手動複製");
    }
  };

  const handleExportICS = async () => {
    if (selected.length === 0) return;
    const ics = generateICS(selected, `大港開唱 Day${day}`);
    await downloadICS(ics, `megaport-day${day}.ics`);
  };

  const disabled = selected.length === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur border-t border-zinc-800 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-50">
      <div className="max-w-2xl mx-auto flex gap-2 justify-center">
        <button
          onClick={handleDownloadImage}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下載圖片
        </button>
        <button
          onClick={handleCopySchedule}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-lg font-bold text-sm hover:bg-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          複製行程
        </button>
        <button
          onClick={handleExportICS}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-lg font-bold text-sm hover:bg-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          匯出日曆
        </button>
      </div>
    </div>
  );
}
