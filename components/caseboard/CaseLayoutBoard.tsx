import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { evaluateLayoutCase } from "../../lib/caseboardUtils";
import type { CaseLayoutCase } from "../../lib/caseboardTypes";
import { palette, radii } from "../../lib/theme";

type CaseLayoutBoardProps = {
  puzzle: CaseLayoutCase;
  resetToken: number;
  solved: boolean;
  onSolved: () => void;
};

export function CaseLayoutBoard({
  puzzle,
  resetToken,
  solved,
  onSolved,
}: CaseLayoutBoardProps) {
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string | null>>(
    createEmptyPlacements(puzzle),
  );
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setSelectedPieceId(null);
    setPlacements(createEmptyPlacements(puzzle));
    setAttempted(false);
  }, [puzzle, resetToken]);

  const pieceToSlot = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(placements)
          .filter(([, pieceId]) => pieceId)
          .map(([slotId, pieceId]) => [pieceId as string, slotId]),
      ) as Record<string, string>,
    [placements],
  );
  const evaluation = evaluateLayoutCase(puzzle, placements);

  function placeSelectedPiece(slotId: string) {
    if (!selectedPieceId || solved) {
      return;
    }

    setPlacements((current) => {
      const next = { ...current };
      const previousSlotId = pieceToSlot[selectedPieceId];
      if (previousSlotId) {
        next[previousSlotId] = null;
      }
      next[slotId] = selectedPieceId;
      return next;
    });
  }

  function clearSlot(slotId: string) {
    if (solved) {
      return;
    }
    setPlacements((current) => ({ ...current, [slotId]: null }));
  }

  function submit() {
    setAttempted(true);
    if (evaluation.solved) {
      onSolved();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.boardWrap}>
        <View style={styles.circleBoard}>
          {puzzle.board.slots.map((slot) => (
            <Pressable
              key={slot.id}
              style={[
                styles.slot,
                {
                  top: `${slot.topPct}%`,
                  left: `${slot.leftPct}%`,
                },
                placements[slot.id] && styles.slotFilled,
              ]}
              onPress={() => placeSelectedPiece(slot.id)}
              onLongPress={() => clearSlot(slot.id)}
            >
              <Text style={styles.slotLabel}>{slot.label}</Text>
              <Text style={styles.slotPiece}>{placements[slot.id] ?? "＋"}</Text>
            </Pressable>
          ))}
          <View style={styles.boardCenter}>
            <Text style={styles.boardCenterText}>ROUND</Text>
          </View>
        </View>
      </View>

      <View style={styles.pieceRow}>
        {puzzle.board.pieces.map((piece) => {
          const used = Boolean(pieceToSlot[piece.id]);
          const active = selectedPieceId === piece.id;
          return (
            <Pressable
              key={piece.id}
              style={[
                styles.pieceChip,
                active && styles.pieceChipActive,
                used && styles.pieceChipUsed,
              ]}
              onPress={() => setSelectedPieceId((current) => (current === piece.id ? null : piece.id))}
            >
              <Text style={styles.pieceChipText}>{piece.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.submitButton} onPress={submit}>
        <Text style={styles.submitButtonText}>配置を確定する</Text>
      </Pressable>

      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackTitle}>
          {solved
            ? "Layout solved"
            : attempted && evaluation.violations.length
              ? "位置条件に違反しています"
              : attempted
                ? "まだ条件を満たしていません"
                : "操作ガイド"}
        </Text>
        <Text style={styles.feedbackText}>
          {solved
            ? "すべての配置条件を満たして円卓を完成できました。"
            : attempted && evaluation.violations.length
              ? evaluation.violations[0].text
              : attempted
                ? "未配置の席か、合っていない位置関係があります。"
                : "人物を選び、席をタップして配置します。長押しでその席を空に戻せます。"}
        </Text>
      </View>
    </View>
  );
}

function createEmptyPlacements(puzzle: CaseLayoutCase) {
  return Object.fromEntries(puzzle.board.slots.map((slot) => [slot.id, null])) as Record<
    string,
    string | null
  >;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    gap: 10,
  },
  boardWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleBoard: {
    width: 260,
    height: 260,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  slot: {
    position: "absolute",
    width: 52,
    height: 52,
    marginLeft: -26,
    marginTop: -26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  slotFilled: {
    backgroundColor: "rgba(143,169,255,0.18)",
    borderColor: "rgba(143,169,255,0.42)",
  },
  slotLabel: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "700",
  },
  slotPiece: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "800",
  },
  boardCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 96,
    height: 96,
    marginLeft: -48,
    marginTop: -48,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  boardCenterText: {
    color: palette.gold,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  pieceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pieceChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  pieceChipActive: {
    backgroundColor: "rgba(129,214,197,0.18)",
    borderColor: "rgba(129,214,197,0.44)",
  },
  pieceChipUsed: {
    opacity: 0.5,
  },
  pieceChipText: {
    color: palette.text,
    fontWeight: "700",
  },
  submitButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.gold,
  },
  submitButtonText: {
    color: palette.night,
    fontWeight: "800",
  },
  feedbackCard: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 4,
  },
  feedbackTitle: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  feedbackText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});
