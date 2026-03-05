const STORAGE_KEY = "megaport-lineup-selected";

function isValidData(data: unknown): data is Record<number, string[]> {
  if (typeof data !== "object" || data === null || Array.isArray(data))
    return false;
  for (const [key, value] of Object.entries(data)) {
    if (isNaN(Number(key))) return false;
    if (!Array.isArray(value) || !value.every((v) => typeof v === "string"))
      return false;
  }
  return true;
}

export function getSelectedIds(): Record<number, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return isValidData(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveSelectedIds(data: Record<number, string[]>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSelectedForDay(day: number): string[] {
  const all = getSelectedIds();
  return all[day] || [];
}

export function toggleArtist(day: number, artistId: string): string[] {
  const all = getSelectedIds();
  const current = all[day] || [];
  const index = current.indexOf(artistId);
  if (index >= 0) {
    current.splice(index, 1);
  } else {
    current.push(artistId);
  }
  all[day] = current;
  saveSelectedIds(all);
  return current;
}
