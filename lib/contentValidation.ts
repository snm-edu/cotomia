import type {
  Character,
  ContentBundle,
  GlossaryEntry,
  LogicQuiz,
  ReadingQuiz,
  StoryData,
} from "./types.ts";

const READING_TYPES = new Set(["image_choice", "context_insert", "summary_builder"]);
const LOGIC_TYPES = new Set(["order_sort", "truth_logic", "seat_puzzle"]);

function collectDuplicateIds(items: { id: string }[], label: string): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) {
      duplicates.add(`${label} id duplicated: ${item.id}`);
    }
    seen.add(item.id);
  }

  return [...duplicates];
}

function validateStory(story: StoryData): string[] {
  const issues: string[] = [];
  const chapters = story.chapters ?? [];
  issues.push(...collectDuplicateIds(chapters, "chapter"));

  const allEpisodes = chapters.flatMap((chapter) => chapter.episodes ?? []);
  issues.push(...collectDuplicateIds(allEpisodes, "episode"));

  for (const chapter of chapters) {
    if (!chapter.title || !chapter.subtitle || !chapter.sourceRef) {
      issues.push(`chapter missing required fields: ${chapter.id}`);
    }

    for (const episode of chapter.episodes ?? []) {
      if (!episode.lines?.length) {
        issues.push(`episode must include lines: ${episode.id}`);
      }
      if (!episode.sourceRef) {
        issues.push(`episode missing sourceRef: ${episode.id}`);
      }
    }
  }

  return issues;
}

function validateReading(
  readingQuizzes: ReadingQuiz[],
  episodeIds: Set<string>,
): string[] {
  const issues = collectDuplicateIds(readingQuizzes, "reading quiz");

  for (const quiz of readingQuizzes) {
    if (!READING_TYPES.has(quiz.type)) {
      issues.push(`unsupported reading quiz type: ${quiz.id}`);
    }
    if (!episodeIds.has(quiz.episodeId)) {
      issues.push(`reading quiz episode reference missing: ${quiz.id} -> ${quiz.episodeId}`);
    }
    if (!quiz.sourceRef) {
      issues.push(`reading quiz missing sourceRef: ${quiz.id}`);
    }

    if (quiz.type === "image_choice") {
      if (!quiz.choices.some((choice) => choice.id === quiz.answerId)) {
        issues.push(`image_choice answer missing from choices: ${quiz.id}`);
      }
    }

    if (quiz.type === "context_insert") {
      for (const blank of quiz.blanks) {
        if (!quiz.options.includes(blank.answer)) {
          issues.push(`context_insert blank answer missing from options: ${quiz.id}/${blank.id}`);
        }
      }
    }

    if (quiz.type === "summary_builder") {
      const fragmentIds = new Set(quiz.fragments.map((fragment) => fragment.id));
      for (const fragmentId of quiz.answerOrder) {
        if (!fragmentIds.has(fragmentId)) {
          issues.push(`summary_builder answer uses unknown fragment: ${quiz.id}/${fragmentId}`);
        }
      }
    }
  }

  return issues;
}

function validateLogic(logicQuizzes: LogicQuiz[]): string[] {
  const issues = collectDuplicateIds(logicQuizzes, "logic quiz");

  for (const quiz of logicQuizzes) {
    if (!LOGIC_TYPES.has(quiz.type)) {
      issues.push(`unsupported logic quiz type: ${quiz.id}`);
    }
    if (!quiz.sourceRef) {
      issues.push(`logic quiz missing sourceRef: ${quiz.id}`);
    }

    if (quiz.type === "order_sort") {
      const itemIds = new Set(quiz.items.map((item) => item.id));
      if (itemIds.size !== quiz.items.length) {
        issues.push(`order_sort item ids duplicated: ${quiz.id}`);
      }
      if (quiz.answerOrder.length !== quiz.items.length) {
        issues.push(`order_sort answer length mismatch: ${quiz.id}`);
      }
      for (const itemId of quiz.answerOrder) {
        if (!itemIds.has(itemId)) {
          issues.push(`order_sort answer references unknown item: ${quiz.id}/${itemId}`);
        }
      }
    } else if (quiz.answerIndex < 0 || quiz.answerIndex >= quiz.choices.length) {
      issues.push(`multiple choice answerIndex out of range: ${quiz.id}`);
    }
  }

  return issues;
}

function validateCharacters(characters: Character[]): string[] {
  const issues = collectDuplicateIds(characters, "character");

  for (const character of characters) {
    if (!character.name || !character.role || !character.accent) {
      issues.push(`character missing required fields: ${character.id}`);
    }
  }

  return issues;
}

function validateGlossary(glossary: GlossaryEntry[]): string[] {
  const issues = collectDuplicateIds(glossary, "glossary");

  for (const entry of glossary) {
    if (!entry.term || !entry.description || !entry.sourceRef) {
      issues.push(`glossary missing required fields: ${entry.id}`);
    }
  }

  return issues;
}

export function validateContentBundle(content: ContentBundle): string[] {
  const issues: string[] = [];
  issues.push(...validateStory(content.story));

  const episodeIds = new Set(
    content.story.chapters.flatMap((chapter) => chapter.episodes.map((episode) => episode.id)),
  );

  issues.push(...validateReading(content.readingQuizzes, episodeIds));
  issues.push(...validateLogic(content.logicQuizzes));
  issues.push(...validateCharacters(content.characters));
  issues.push(...validateGlossary(content.glossary));

  return issues;
}
