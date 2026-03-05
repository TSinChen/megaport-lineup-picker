"use client";

import { useState, useEffect } from "react";
import { Artist } from "@/types";
import { formatTime } from "@/lib/format";

function toGoogleCalendarDate(iso: string): string {
  // "2026-03-21T12:30" → "20260321T043000Z" (convert +0800 to UTC)
  const date = new Date(iso);
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function getGoogleCalendarUrl(artist: Artist): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: artist.name,
    dates: `${toGoogleCalendarDate(artist.startTime)}/${toGoogleCalendarDate(artist.endTime)}`,
    location: `大港開唱 ${artist.stage}`,
    details: `大港開唱 - ${artist.stage}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

interface SelectedListProps {
  artists: Artist[];
  selectedIds: string[];
  onToggle: (artistId: string) => void;
}

export default function SelectedList({
  artists,
  selectedIds,
  onToggle,
}: SelectedListProps) {
  const [isIOSSafari, setIsIOSSafari] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    setIsIOSSafari(
      isIOS && /Safari/i.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/i.test(ua)
    );
  }, []);

  const selected = artists
    .filter((a) => selectedIds.includes(a.id))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  if (selected.length === 0) {
    return (
      <div className="text-zinc-400 text-sm py-4 text-center">
        點擊圖片上的藝人名稱來加入行程
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-sm font-bold text-zinc-400 mb-2">
        已選 {selected.length} 組藝人
      </p>
      {selected.map((artist) => (
        <div
          key={artist.id}
          className="flex items-center justify-between gap-4 bg-zinc-800/50 rounded-lg px-3 py-2 group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-yellow-400 font-mono text-sm shrink-0">
              {formatTime(artist.startTime)}
            </span>
            <span className="text-zinc-400 text-xs shrink-0">{artist.stage}</span>
            <span className="text-white text-sm font-medium truncate">
              {artist.name}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!isIOSSafari && (
              <a
                href={getGoogleCalendarUrl(artist)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 active:text-yellow-300 transition-colors p-1.5"
                title="加入 Google 日曆"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </a>
            )}
            <button
              onClick={() => onToggle(artist.id)}
              className="text-red-400 hover:text-red-300 active:text-red-300 transition-colors text-xl p-2"
              title="移除"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
