import { createEvents, type EventAttributes } from "ics";
import { Artist } from "@/types";

function parseLocalDateTime(
  iso: string
): [number, number, number, number, number] {
  // "2026-03-28T15:00" → [2026, 3, 28, 15, 0]
  const [datePart, timePart] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [h, min] = timePart.split(":").map(Number);
  return [y, m, d, h, min];
}

export function generateICS(artists: Artist[], dayLabel: string): string {
  const events: EventAttributes[] = artists.map((a) => ({
    uid: `${a.id}@megaport-lineup`,
    title: a.name,
    location: `大港開唱 ${a.stage}`,
    description: `${dayLabel} - ${a.stage}`,
    start: parseLocalDateTime(a.startTime),
    startInputType: "local" as const,
    startOutputType: "local" as const,
    end: parseLocalDateTime(a.endTime),
    endInputType: "local" as const,
    endOutputType: "local" as const,
    calName: "Megaport Lineup",
  }));

  const { error, value } = createEvents(events, {
    productId: "//Megaport Lineup Tool//EN",
  });

  if (error) {
    throw error;
  }

  return value!;
}

export async function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });

  // 手機優先用原生分享，讓系統提示用日曆 App 開啟
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], filename, { type: "text/calendar" });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch {
        // 使用者取消分享，fallback 到下載
      }
    }
  }

  // 桌面 fallback
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
