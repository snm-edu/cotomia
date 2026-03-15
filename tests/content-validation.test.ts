import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCaseboardCases } from "../lib/caseboardValidation.ts";
import { validateContentBundle } from "../lib/contentValidation.ts";

function readJson(path: string) {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), "utf8"));
}

test("content bundle passes validation", () => {
  const issues = validateContentBundle({
    story: readJson("data/story.json"),
    readingQuizzes: readJson("data/readingQuizzes.json"),
    logicQuizzes: readJson("data/dailyLogicQuizzes.json"),
    characters: readJson("data/characters.json"),
    glossary: readJson("data/glossary.json"),
  });

  assert.deepEqual(issues, []);
});

test("caseboard content passes validation", () => {
  const issues = validateCaseboardCases(readJson("data/caseboardCases.json"));
  assert.deepEqual(issues, []);
});
