import { useLocalSearchParams } from "expo-router";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { ReadingQuizRenderer } from "../../components/ReadingQuizRenderer";
import {
  characterById,
  episodeById,
  readingQuizById,
  readingQuizData,
} from "../../lib/content";
import { useGameStore } from "../../store/useGameStore";

export function generateStaticParams() {
  return readingQuizData.map((quiz) => ({ id: quiz.id }));
}

export default function ReadingQuizScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const quizId = typeof params.id === "string" ? params.id : "";
  const quiz = readingQuizById[quizId];

  const completedReadingQuizIds = useGameStore((state) => state.completedReadingQuizIds);
  const submitReadingQuiz = useGameStore((state) => state.submitReadingQuiz);

  if (!quiz) {
    return (
      <ScreenFrame title="読解ミッションが見つかりません">
        <SectionCard subtitle="ルートパラメータが不正です。" />
      </ScreenFrame>
    );
  }

  const episode = episodeById[quiz.episodeId];
  const featuredCharacter = characterById[episode.featuredCharacterId];

  return (
    <ScreenFrame
      title={quiz.title}
      subtitle={`${episode.title} / ${featuredCharacter?.name ?? "ナビ"}が担当`}
    >
      <ReadingQuizRenderer
        quiz={quiz}
        completed={completedReadingQuizIds.includes(quiz.id)}
        onSolved={() =>
          submitReadingQuiz(
            quiz.id,
            quiz.reward,
            episode.featuredCharacterId,
            episode.glossaryUnlockIds,
          )}
      />
    </ScreenFrame>
  );
}
