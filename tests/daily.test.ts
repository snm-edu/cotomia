import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getDailyLogicSelection } from "../lib/daily.ts";
import type { LogicQuiz } from "../lib/types.ts";

const logicQuizzes = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/dailyLogicQuizzes.json"), "utf8"),
) as LogicQuiz[];

test("daily selection is stable for the same date", () => {
  const first = getDailyLogicSelection(logicQuizzes, "2026-03-14").map((quiz) => quiz.id);
  const second = getDailyLogicSelection(logicQuizzes, "2026-03-14").map((quiz) => quiz.id);
  assert.deepEqual(first, second);
});

test("daily selection rotates across dates when each type has multiple quizzes", () => {
  const first = getDailyLogicSelection(logicQuizzes, "2026-03-14").map((quiz) => quiz.id);
  const second = getDailyLogicSelection(logicQuizzes, "2026-03-15").map((quiz) => quiz.id);
  assert.notDeepEqual(first, second);
  assert.equal(first.length, 3);
  assert.equal(second.length, 3);
});
