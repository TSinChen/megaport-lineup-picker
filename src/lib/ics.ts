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

export function downloadICS(content: string, filename: string) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // 手機：用 data URI 導航，觸發系統原生日曆處理
    window.location.href =
      "data:text/calendar;charset=utf-8," + encodeURIComponent(content);
    return;
  }

  // 桌面：blob URL 下載
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
