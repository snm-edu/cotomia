import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { characterData } from "../lib/content";
import {
  claimDailyLoginProgress,
  createInitialProgress,
  migrateProgress,
  submitLogicQuizProgress,
  submitReadingQuizProgress,
  unlockGlossaryProgress,
  advanceEpisodeProgress,
} from "../lib/progress";
import type { GameProgressV1, Reward } from "../lib/types";

const STORAGE_KEY = "asklepios-academy-progress";
const characterIds = characterData.map((character) => character.id);

type GameStore = GameProgressV1 & {
  hydrated: boolean;
  hydrateProgress: () => Promise<void>;
  advanceEpisode: (episodeId: string, glossaryIds?: string[]) => void;
  submitReadingQuiz: (
    quizId: string,
    reward: Reward,
    featuredCharacterId?: string,
    glossaryIds?: string[],
  ) => void;
  submitLogicQuiz: (
    quizId: string,
    reward: Reward,
    featuredCharacterId?: string,
  ) => void;
  claimDailyLogin: (
    dateKey: string,
    reward?: Reward,
    featuredCharacterId?: string,
  ) => void;
  unlockGlossary: (glossaryIds: string[]) => void;
  resetProgress: () => void;
};

const initialProgress = createInitialProgress(characterIds);

export const useGameStore = create<GameStore>()(
  persist(
    (set, _get, api) => ({
      ...initialProgress,
      hydrated: false,
      hydrateProgress: async () => {
        await (api as typeof api & { persist: { rehydrate: () => Promise<void> } }).persist
          .rehydrate();
        set({ hydrated: true });
      },
      advanceEpisode: (episodeId, glossaryIds = []) =>
        set((state) => advanceEpisodeProgress(state, episodeId, glossaryIds)),
      submitReadingQuiz: (
        quizId,
        reward,
        featuredCharacterId = "selene",
        glossaryIds = [],
      ) =>
        set((state) =>
          submitReadingQuizProgress(
            state,
            quizId,
            reward,
            featuredCharacterId,
            glossaryIds,
          ),
        ),
      submitLogicQuiz: (quizId, reward, featuredCharacterId = "nox") =>
        set((state) => submitLogicQuizProgress(state, quizId, reward, featuredCharacterId)),
      claimDailyLogin: (dateKey, reward, featuredCharacterId = "selene") =>
        set((state) =>
          claimDailyLoginProgress(state, dateKey, reward, featuredCharacterId),
        ),
      unlockGlossary: (glossaryIds) =>
        set((state) => unlockGlossaryProgress(state, glossaryIds)),
      resetProgress: () => set({ ...createInitialProgress(characterIds), hydrated: true }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: true,
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        readEpisodeIds: state.readEpisodeIds,
        completedReadingQuizIds: state.completedReadingQuizIds,
        completedLogicQuizIds: state.completedLogicQuizIds,
        unlockedGlossaryIds: state.unlockedGlossaryIds,
        characterAffection: state.characterAffection,
        coins: state.coins,
        seeds: state.seeds,
        lastLoginDate: state.lastLoginDate,
      }),
      migrate: async (persistedState) =>
        migrateProgress(persistedState as Partial<GameProgressV1>, characterIds),
    },
  ),
);
