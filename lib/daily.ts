import type { LogicQuiz } from "./types.ts";

const DAILY_TYPES = ["order_sort", "truth_logic", "seat_puzzle"] as const;

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashDateKey(dateKey: string): number {
  return [...dateKey].reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function getDailyLogicSelection(
  logicQuizzes: LogicQuiz[],
  dateKey = getLocalDateKey(),
): LogicQuiz[] {
  const hash = hashDateKey(dateKey);

  return DAILY_TYPES.flatMap((type, offset) => {
    const pool = logicQuizzes.filter((quiz) => quiz.type === type);
    if (!pool.length) {
      return [];
    }

    return pool[(hash + offset) % pool.length];
  });
}
