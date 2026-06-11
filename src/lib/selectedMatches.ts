const STORAGE_KEY = "selectedMatches";

export function readSelectedMatches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function writeSelectedMatches(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
