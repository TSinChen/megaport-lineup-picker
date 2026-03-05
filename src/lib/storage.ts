const STORAGE_KEY_PREFIX = "megaport-lineup-selected";

function getStorageKey(year: number): string {
  return `${STORAGE_KEY_PREFIX}-${year}`;
}

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

export function getSelectedIds(year: number): Record<number, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(getStorageKey(year));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return isValidData(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveSelectedIds(year: number, data: Record<number, string[]>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getStorageKey(year), JSON.stringify(data));
}

export function getSelectedForDay(year: number, day: number): string[] {
  const all = getSelectedIds(year);
  return all[day] || [];
}

export function toggleArtist(year: number, day: number, artistId: string): string[] {
  const all = getSelectedIds(year);
  const current = all[day] || [];
  const index = current.indexOf(artistId);
  if (index >= 0) {
    current.splice(index, 1);
  } else {
    current.push(artistId);
  }
  all[day] = current;
  saveSelectedIds(year, all);
  return current;
}
