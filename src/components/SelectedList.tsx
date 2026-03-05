"use client";

import { Artist } from "@/types";
import { formatTime } from "@/lib/format";

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
  const selected = artists
    .filter((a) => selectedIds.includes(a.id))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  if (selected.length === 0) {
    return (
      <div className="text-zinc-500 text-sm py-4 text-center">
        點擊圖片上的藝人名稱來加入行程
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-bold text-zinc-400 mb-2">
        已選 {selected.length} 組藝人
      </h3>
      {selected.map((artist) => (
        <div
          key={artist.id}
          className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2 group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-yellow-400 font-mono text-sm shrink-0">
              {formatTime(artist.startTime)}
            </span>
            <span className="text-zinc-500 text-xs shrink-0">{artist.stage}</span>
            <span className="text-white text-sm font-medium truncate">
              {artist.name}
            </span>
          </div>
          <button
            onClick={() => onToggle(artist.id)}
            className="text-zinc-600 hover:text-red-400 active:text-red-400 transition-colors sm:opacity-0 sm:group-hover:opacity-100 text-lg p-1"
            title="移除"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
