import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  evaluateGridCase,
  evaluateLayoutCase,
  evaluateRuleCase,
} from "../lib/caseboardUtils.ts";
import type {
  CaseGridCase,
  CaseLayoutCase,
  GridMark,
  RuleForgeCase,
} from "../lib/caseboardTypes.ts";

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), "utf8")) as T;
}

const puzzles = readJson<Array<CaseGridCase | CaseLayoutCase | RuleForgeCase>>(
  "data/caseboardCases.json",
);

test("grid case solver accepts the published solution", () => {
  const puzzle = puzzles.find((item) => item.id === "grid-shift-001") as CaseGridCase;
  const marks = Object.fromEntries(
    puzzle.board.solutionYesCells.map((cellId) => [cellId, "yes"]),
  ) as Record<string, GridMark>;

  const result = evaluateGridCase(puzzle, marks);
  assert.equal(result.solved, true);
  assert.deepEqual(result.contradictions, []);
});

test("layout case solver accepts the published solution", () => {
  const puzzle = puzzles.find((item) => item.id === "layout-roundtable-001") as CaseLayoutCase;
  const result = evaluateLayoutCase(puzzle, puzzle.board.solution);
  assert.equal(result.solved, true);
  assert.deepEqual(result.violations, []);
});

test("rule case solver accepts the published solution", () => {
  const puzzle = puzzles.find((item) => item.id === "rule-code-001") as RuleForgeCase;
  const result = evaluateRuleCase(puzzle, puzzle.board.solution);
  assert.equal(result.solved, true);
  assert.equal(result.challengeOutput, puzzle.board.challengeOutput);
});
