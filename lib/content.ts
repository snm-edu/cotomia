import story from "../data/story.json";
import readingQuizzes from "../data/readingQuizzes.json";
import logicQuizzes from "../data/dailyLogicQuizzes.json";
import characters from "../data/characters.json";
import glossary from "../data/glossary.json";
import { validateContentBundle } from "./contentValidation";
import type {
  Character,
  GlossaryEntry,
  LogicQuiz,
  ReadingQuiz,
  StoryData,
  StoryChapter,
  StoryEpisode,
} from "./types";

export const storyData = story as StoryData;
export const readingQuizData = readingQuizzes as ReadingQuiz[];
export const logicQuizData = logicQuizzes as LogicQuiz[];
export const characterData = characters as Character[];
export const glossaryData = glossary as GlossaryEntry[];

export const contentIssues = validateContentBundle({
  story: storyData,
  readingQuizzes: readingQuizData,
  logicQuizzes: logicQuizData,
  characters: characterData,
  glossary: glossaryData,
});

export const chapters = storyData.chapters as StoryChapter[];
export const episodes = chapters.flatMap((chapter) => chapter.episodes as StoryEpisode[]);

export const chapterById = Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter]));
export const episodeById = Object.fromEntries(episodes.map((episode) => [episode.id, episode]));
export const readingQuizById = Object.fromEntries(
  readingQuizData.map((quiz) => [quiz.id, quiz]),
);
export const logicQuizById = Object.fromEntries(logicQuizData.map((quiz) => [quiz.id, quiz]));
export const characterById = Object.fromEntries(
  characterData.map((character) => [character.id, character]),
);
export const glossaryById = Object.fromEntries(glossaryData.map((entry) => [entry.id, entry]));

export function getNextUnreadEpisode(readEpisodeIds: string[]): StoryEpisode | null {
  return episodes.find((episode) => !readEpisodeIds.includes(episode.id)) ?? null;
}

export function getChapterProgress(chapterId: string, readEpisodeIds: string[]): number {
  const chapter = chapterById[chapterId];
  if (!chapter) {
    return 0;
  }

  const total = chapter.episodes.length;
  const completed = chapter.episodes.filter((episode) => readEpisodeIds.includes(episode.id)).length;
  return total ? completed / total : 0;
}
