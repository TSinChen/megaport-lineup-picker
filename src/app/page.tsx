"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DayLineup } from "@/types";
import { getSelectedForDay, toggleArtist } from "@/lib/storage";
import DayTabs from "@/components/DayTabs";
import LineupCanvas from "@/components/LineupCanvas";
import SelectedList from "@/components/SelectedList";
import ActionBar from "@/components/ActionBar";
import day1Data from "@/data/day1.json";
import day2Data from "@/data/day2.json";

const lineups: Record<number, DayLineup> = {
  1: day1Data as DayLineup,
  2: day2Data as DayLineup,
};

export default function Home() {
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lineup = lineups[currentDay];

  // 從 LocalStorage 還原勾選狀態
  useEffect(() => {
    setSelectedIds(getSelectedForDay(currentDay));
  }, [currentDay]);

  const handleToggle = useCallback(
    (artistId: string) => {
      const updated = toggleArtist(currentDay, artistId);
      setSelectedIds([...updated]);
    },
    [currentDay]
  );

  return (
    <main className="max-w-2xl mx-auto pt-6 pb-24">
      <header className="text-center mb-6 px-4">
        <h1 className="text-2xl font-black tracking-tight">
          大港開唱 選團器
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          點擊圖片上的藝人來標記，分享圖片或加入日曆
        </p>
      </header>

      <div className="flex justify-center mb-4 px-4">
        <DayTabs
          currentDay={currentDay}
          onDayChange={setCurrentDay}
          days={Object.values(lineups).map((l) => ({ day: l.day, date: l.date }))}
        />
      </div>

      <div className="md:rounded-xl overflow-hidden md:border md:border-zinc-800 mb-4">
        <LineupCanvas
          imageFile={lineup.imageFile}
          artists={lineup.artists}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          canvasRef={canvasRef}
        />
      </div>

      <div className="px-4">
      <SelectedList
        artists={lineup.artists}
        selectedIds={selectedIds}
        onToggle={handleToggle}
      />
      </div>

      <ActionBar
        canvasRef={canvasRef}
        artists={lineup.artists}
        selectedIds={selectedIds}
        day={currentDay}
        date={lineup.date}
      />
    </main>
  );
}
