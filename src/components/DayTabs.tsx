"use client";

interface DayTabsProps {
  currentDay: number;
  onDayChange: (day: number) => void;
}

export default function DayTabs({ currentDay, onDayChange }: DayTabsProps) {
  const days = [
    { day: 1, label: "Day 1 (3/28)" },
    { day: 2, label: "Day 2 (3/29)" },
  ];

  return (
    <div className="flex gap-2">
      {days.map(({ day, label }) => (
        <button
          key={day}
          onClick={() => onDayChange(day)}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${
            currentDay === day
              ? "bg-yellow-400 text-black"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
