import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateContentBundle } from "../lib/contentValidation.ts";
import type { Character, GlossaryEntry, LogicQuiz, ReadingQuiz, StoryData } from "../lib/types.ts";

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), "utf8")) as T;
}

const content = {
  story: readJson<StoryData>("data/story.json"),
  readingQuizzes: readJson<ReadingQuiz[]>("data/readingQuizzes.json"),
  logicQuizzes: readJson<LogicQuiz[]>("data/dailyLogicQuizzes.json"),
  characters: readJson<Character[]>("data/characters.json"),
  glossary: readJson<GlossaryEntry[]>("data/glossary.json"),
};

const issues = validateContentBundle(content);

if (issues.length) {
  console.error("Content validation failed:");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exitCode = 1;
} else {
  console.log("Content validation passed.");
}
