import type { TripAnswers } from "../types/tripAnswers.ts";

const STORAGE_KEY = "tripAnswers";

export function readTripAnswers(): TripAnswers | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TripAnswers;
  } catch {
    return null;
  }
}

export function writeTripAnswers(answers: TripAnswers): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}
