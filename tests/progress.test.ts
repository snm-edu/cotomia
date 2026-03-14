import test from "node:test";
import assert from "node:assert/strict";
import {
  claimDailyLoginProgress,
  createInitialProgress,
  submitLogicQuizProgress,
  submitReadingQuizProgress,
  advanceEpisodeProgress,
} from "../lib/progress.ts";

test("claimDailyLoginProgress only rewards once per day", () => {
  const initial = createInitialProgress(["selene", "ria"]);
  const once = claimDailyLoginProgress(initial, "2026-03-14");
  const twice = claimDailyLoginProgress(once, "2026-03-14");

  assert.equal(once.coins, 6);
  assert.equal(once.seeds, 1);
  assert.equal(once.characterAffection.selene, 2);
  assert.deepEqual(twice, once);
});

test("submitReadingQuizProgress rewards only on first clear and unlocks glossary", () => {
  const initial = createInitialProgress(["selene", "ria"]);
  const first = submitReadingQuizProgress(
    initial,
    "rq-001",
    { affection: 5, coins: 10 },
    "ria",
    ["staff"],
  );
  const second = submitReadingQuizProgress(
    first,
    "rq-001",
    { affection: 5, coins: 10 },
    "ria",
    ["staff"],
  );

  assert.equal(first.coins, 10);
  assert.equal(first.characterAffection.ria, 5);
  assert.deepEqual(first.unlockedGlossaryIds, ["staff"]);
  assert.deepEqual(second, first);
});

test("advanceEpisodeProgress and submitLogicQuizProgress track progression", () => {
  const initial = createInitialProgress(["selene", "nox"]);
  const read = advanceEpisodeProgress(initial, "ep-001", ["hippocrates"]);
  const solved = submitLogicQuizProgress(
    read,
    "dq-001",
    { affection: 3, seeds: 1, coins: 5 },
    "nox",
  );

  assert.deepEqual(read.readEpisodeIds, ["ep-001"]);
  assert.deepEqual(read.unlockedGlossaryIds, ["hippocrates"]);
  assert.deepEqual(solved.completedLogicQuizIds, ["dq-001"]);
  assert.equal(solved.characterAffection.nox, 3);
  assert.equal(solved.seeds, 1);
});
