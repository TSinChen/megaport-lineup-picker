"use client";

interface DayTabsProps {
  currentDay: number;
  onDayChange: (day: number) => void;
  days: { day: number; date: string }[];
}

export default function DayTabs({ currentDay, onDayChange, days }: DayTabsProps) {
  return (
    <div className="flex gap-2">
      {days.map(({ day, date }) => {
        const [, m, d] = date.split("-");
        const label = `Day ${day} (${parseInt(m)}/${parseInt(d)})`;
        return (
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
        );
      })}
    </div>
  );
}
