import { useLocalSearchParams } from "expo-router";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { LogicQuizRenderer } from "../../components/LogicQuizRenderer";
import { getCaseboardModeMeta } from "../../lib/caseboard";
import { logicQuizById, logicQuizData } from "../../lib/content";
import { useGameStore } from "../../store/useGameStore";

export function generateStaticParams() {
  return logicQuizData.map((quiz) => ({ id: quiz.id }));
}

export default function LogicQuizScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const quizId = typeof params.id === "string" ? params.id : "";
  const quiz = logicQuizById[quizId];

  const completedLogicQuizIds = useGameStore((state) => state.completedLogicQuizIds);
  const submitLogicQuiz = useGameStore((state) => state.submitLogicQuiz);

  if (!quiz) {
    return (
      <ScreenFrame title="ケースが見つかりません">
        <SectionCard subtitle="ルートパラメータが不正です。" />
      </ScreenFrame>
    );
  }

  const mode = getCaseboardModeMeta(quiz);

  return (
    <ScreenFrame
      title={quiz.title}
      subtitle={`${mode.label} / CASEBOARD mini / ${quiz.sourceRef}`}
    >
      <LogicQuizRenderer
        quiz={quiz}
        completed={completedLogicQuizIds.includes(quiz.id)}
        onSolved={() => submitLogicQuiz(quiz.id, quiz.reward)}
      />
    </ScreenFrame>
  );
}
