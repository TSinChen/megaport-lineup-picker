"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DayLineup } from "@/types";
import { getSelectedForDay, toggleArtist } from "@/lib/storage";
import DayTabs from "@/components/DayTabs";
import LineupCanvas from "@/components/LineupCanvas";
import SelectedList from "@/components/SelectedList";
import ActionBar from "@/components/ActionBar";
import day1Data from "@/data/2026/day1.json";
import day2Data from "@/data/2026/day2.json";

const lineups: Record<number, DayLineup> = {
  1: day1Data as DayLineup,
  2: day2Data as DayLineup,
};

function getDefaultDay(): number {
  const today = new Date().toISOString().slice(0, 10);
  for (const lineup of Object.values(lineups)) {
    if (lineup.date === today) return lineup.day;
  }
  return 1;
}

export default function Home() {
  const [currentDay, setCurrentDay] = useState(getDefaultDay);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lineup = lineups[currentDay];
  const year = lineup.year;

  // 從 LocalStorage 還原勾選狀態
  useEffect(() => {
    setSelectedIds(getSelectedForDay(year, currentDay));
  }, [year, currentDay]);

  const handleToggle = useCallback(
    (artistId: string) => {
      const updated = toggleArtist(year, currentDay, artistId);
      setSelectedIds([...updated]);
    },
    [year, currentDay],
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "大港開唱 選團器",
    alternateName: "Megaport Festival Lineup Picker",
    description: "大港開唱選團工具，在 lineup 圖上選團、標記你想看的藝人陣容",
    url: "https://megaport-lineup-picker.com",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "All",
  };

  return (
    <main className="max-w-6xl mx-auto pt-6 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="text-center px-4">
        <h1 className="text-2xl font-black tracking-tight">大港開唱 選團器</h1>
        <p className="text-zinc-400 text-sm mt-1">
          點擊圖片上的藝人來標記，讓大家知道你想聽什麼
        </p>
      </header>

      <div className="flex justify-center px-4 sticky top-0 z-40 bg-black/85 py-3">
        <DayTabs
          currentDay={currentDay}
          onDayChange={setCurrentDay}
          days={Object.values(lineups).map((l) => ({
            day: l.day,
            date: l.date,
          }))}
        />
      </div>

      <div className="lg:flex lg:gap-6 lg:px-4">
        <div className="lg:w-2/3 lg:rounded-xl overflow-hidden lg:border lg:border-zinc-800 mb-4 lg:mb-0 shrink-0">
          <LineupCanvas
            imageFile={lineup.imageFile}
            imageWidth={lineup.imageWidth}
            imageHeight={lineup.imageHeight}
            artists={lineup.artists}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            canvasRef={canvasRef}
          />
        </div>

        <div className="px-4 lg:px-0 lg:w-1/3 lg:min-w-0 lg:sticky lg:top-16 lg:self-start">
          <SelectedList
            artists={lineup.artists}
            selectedIds={selectedIds}
            onToggle={handleToggle}
          />
        </div>
      </div>

      <footer className="text-center text-zinc-400 text-sm px-4 my-6">
        本網站為樂迷自製工具，非大港開唱官方網站。
        <br />
        所有藝人資訊與圖片版權歸原主辦單位所有。
      </footer>

      <ActionBar
        canvasRef={canvasRef}
        artists={lineup.artists}
        selectedIds={selectedIds}
        year={year}
        day={currentDay}
        date={lineup.date}
      />
    </main>
  );
}
