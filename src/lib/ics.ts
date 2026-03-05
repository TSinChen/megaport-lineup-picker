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
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // 手機：不設 download 屬性，讓瀏覽器直接用日曆 App 開啟 .ics
  // 桌面：設 download 屬性觸發下載
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) {
    link.download = filename;
  }

  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
