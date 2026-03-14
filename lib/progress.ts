import type { GameProgressV1, Reward } from "./types.ts";

export const STORAGE_SCHEMA_VERSION = 1;
export const DEFAULT_LOGIN_REWARD: Reward = { affection: 2, coins: 6, seeds: 1 };
const DEFAULT_CHARACTER = "selene";

export function createInitialProgress(characterIds: string[]): GameProgressV1 {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    readEpisodeIds: [],
    completedReadingQuizIds: [],
    completedLogicQuizIds: [],
    unlockedGlossaryIds: [],
    characterAffection: Object.fromEntries(
      characterIds.map((characterId) => [characterId, 0]),
    ),
    coins: 0,
    seeds: 0,
    lastLoginDate: null,
  };
}

export function migrateProgress(
  candidate: Partial<GameProgressV1> | undefined,
  characterIds: string[],
): GameProgressV1 {
  const base = createInitialProgress(characterIds);
  if (!candidate || candidate.schemaVersion !== STORAGE_SCHEMA_VERSION) {
    return base;
  }

  const characterAffection = { ...base.characterAffection, ...candidate.characterAffection };

  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    readEpisodeIds: candidate.readEpisodeIds ?? base.readEpisodeIds,
    completedReadingQuizIds:
      candidate.completedReadingQuizIds ?? base.completedReadingQuizIds,
    completedLogicQuizIds:
      candidate.completedLogicQuizIds ?? base.completedLogicQuizIds,
    unlockedGlossaryIds: candidate.unlockedGlossaryIds ?? base.unlockedGlossaryIds,
    characterAffection,
    coins: candidate.coins ?? 0,
    seeds: candidate.seeds ?? 0,
    lastLoginDate: candidate.lastLoginDate ?? null,
  };
}

export function applyReward(
  progress: GameProgressV1,
  reward: Reward,
  featuredCharacterId = DEFAULT_CHARACTER,
): GameProgressV1 {
  const targetCharacter = progress.characterAffection[featuredCharacterId] !== undefined
    ? featuredCharacterId
    : DEFAULT_CHARACTER;

  return {
    ...progress,
    coins: progress.coins + (reward.coins ?? 0),
    seeds: progress.seeds + (reward.seeds ?? 0),
    characterAffection: {
      ...progress.characterAffection,
      [targetCharacter]:
        progress.characterAffection[targetCharacter] + (reward.affection ?? 0),
    },
  };
}

export function unlockGlossaryProgress(
  progress: GameProgressV1,
  glossaryIds: string[],
): GameProgressV1 {
  return {
    ...progress,
    unlockedGlossaryIds: Array.from(
      new Set([...progress.unlockedGlossaryIds, ...glossaryIds]),
    ),
  };
}

export function advanceEpisodeProgress(
  progress: GameProgressV1,
  episodeId: string,
  glossaryIds: string[] = [],
): GameProgressV1 {
  return unlockGlossaryProgress(
    {
      ...progress,
      readEpisodeIds: Array.from(new Set([...progress.readEpisodeIds, episodeId])),
    },
    glossaryIds,
  );
}

export function submitReadingQuizProgress(
  progress: GameProgressV1,
  quizId: string,
  reward: Reward,
  featuredCharacterId = DEFAULT_CHARACTER,
  glossaryIds: string[] = [],
): GameProgressV1 {
  if (progress.completedReadingQuizIds.includes(quizId)) {
    return unlockGlossaryProgress(progress, glossaryIds);
  }

  return unlockGlossaryProgress(
    applyReward(
      {
        ...progress,
        completedReadingQuizIds: [...progress.completedReadingQuizIds, quizId],
      },
      reward,
      featuredCharacterId,
    ),
    glossaryIds,
  );
}

export function submitLogicQuizProgress(
  progress: GameProgressV1,
  quizId: string,
  reward: Reward,
  featuredCharacterId = DEFAULT_CHARACTER,
): GameProgressV1 {
  if (progress.completedLogicQuizIds.includes(quizId)) {
    return progress;
  }

  return applyReward(
    {
      ...progress,
      completedLogicQuizIds: [...progress.completedLogicQuizIds, quizId],
    },
    reward,
    featuredCharacterId,
  );
}

export function claimDailyLoginProgress(
  progress: GameProgressV1,
  dateKey: string,
  reward: Reward = DEFAULT_LOGIN_REWARD,
  featuredCharacterId = DEFAULT_CHARACTER,
): GameProgressV1 {
  if (progress.lastLoginDate === dateKey) {
    return progress;
  }

  return {
    ...applyReward(progress, reward, featuredCharacterId),
    lastLoginDate: dateKey,
  };
}
