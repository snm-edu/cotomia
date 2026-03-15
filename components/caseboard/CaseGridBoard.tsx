import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { evaluateGridCase, getGridCellId } from "../../lib/caseboardUtils";
import type { CaseGridCase, GridMark } from "../../lib/caseboardTypes";
import { palette, radii } from "../../lib/theme";

type CaseGridBoardProps = {
  puzzle: CaseGridCase;
  resetToken: number;
  solved: boolean;
  onSolved: () => void;
};

const MARK_ORDER: GridMark[] = ["yes", "no", "tentative"];

export function CaseGridBoard({
  puzzle,
  resetToken,
  solved,
  onSolved,
}: CaseGridBoardProps) {
  const [selectedMark, setSelectedMark] = useState<GridMark>("yes");
  const [marks, setMarks] = useState<Record<string, GridMark>>({});
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setMarks({});
    setSelectedMark("yes");
    setAttempted(false);
  }, [resetToken]);

  const evaluation = evaluateGridCase(puzzle, marks);

  function applyMark(cellId: string) {
    if (solved) {
      return;
    }

    setMarks((current) => ({
      ...current,
      [cellId]: current[cellId] === selectedMark ? "unknown" : selectedMark,
    }));
  }

  function submit() {
    setAttempted(true);
    if (evaluation.solved) {
      onSolved();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.markRow}>
        {MARK_ORDER.map((mark) => (
          <Pressable
            key={mark}
            style={[styles.markButton, selectedMark === mark && styles.markButtonActive]}
            onPress={() => setSelectedMark(mark)}
          >
            <Text style={[styles.markButtonText, selectedMark === mark && styles.markButtonTextActive]}>
              {getMarkLabel(mark)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <View style={[styles.headerCell, styles.cornerCell]}>
            <Text style={styles.headerCellText}>休み</Text>
          </View>
          {puzzle.board.columns.map((column) => (
            <View key={column.id} style={styles.headerCell}>
              <Text style={styles.headerCellText}>{column.label}</Text>
              <Text style={styles.counterText}>
                {evaluation.colCounts[column.id] ?? 0}/{column.targetYes}
              </Text>
            </View>
          ))}
        </View>

        {puzzle.board.rows.map((row) => (
          <View key={row.id} style={styles.bodyRow}>
            <View style={[styles.headerCell, styles.rowLabelCell]}>
              <Text style={styles.headerCellText}>{row.label}</Text>
              <Text style={styles.counterText}>
                {evaluation.rowCounts[row.id] ?? 0}/{row.targetYes}
              </Text>
            </View>
            {puzzle.board.columns.map((column) => {
              const cellId = getGridCellId(row.id, column.id);
              const mark = marks[cellId] ?? "unknown";
              return (
                <Pressable
                  key={cellId}
                  style={[styles.gridCell, markStyles[mark]]}
                  onPress={() => applyMark(cellId)}
                >
                  <Text style={styles.gridCellText}>{getMarkSymbol(mark)}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <Pressable style={styles.submitButton} onPress={submit}>
        <Text style={styles.submitButtonText}>解答を確定する</Text>
      </Pressable>

      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackTitle}>
          {solved
            ? "Grid solved"
            : attempted && evaluation.contradictions.length
              ? "矛盾があります"
              : attempted
                ? "まだ完成していません"
                : "操作ガイド"}
        </Text>
        <Text style={styles.feedbackText}>
          {solved
            ? "行と列の目標数を満たし、休み表を完成できました。"
            : attempted && evaluation.contradictions.length
              ? evaluation.contradictions[0]
              : attempted
                ? "必要な ○ の数か、配置のどちらかがまだ合っていません。"
                : "下のボタンで印を選び、表のマスへ配置してください。"}
        </Text>
      </View>
    </View>
  );
}

function getMarkLabel(mark: GridMark) {
  if (mark === "yes") {
    return "○ 休み";
  }
  if (mark === "no") {
    return "× 出勤";
  }
  return "△ 仮置き";
}

function getMarkSymbol(mark: GridMark) {
  if (mark === "yes") {
    return "○";
  }
  if (mark === "no") {
    return "×";
  }
  if (mark === "tentative") {
    return "△";
  }
  return "";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    gap: 10,
  },
  markRow: {
    flexDirection: "row",
    gap: 8,
  },
  markButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  markButtonActive: {
    backgroundColor: "rgba(129,214,197,0.18)",
    borderColor: "rgba(129,214,197,0.45)",
  },
  markButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  markButtonTextActive: {
    color: palette.mint,
  },
  table: {
    gap: 6,
  },
  headerRow: {
    flexDirection: "row",
    gap: 6,
  },
  bodyRow: {
    flexDirection: "row",
    gap: 6,
  },
  cornerCell: {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  headerCell: {
    width: 68,
    minHeight: 50,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabelCell: {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  headerCellText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  counterText: {
    color: palette.muted,
    fontSize: 11,
  },
  gridCell: {
    width: 68,
    height: 50,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  gridCellText: {
    color: palette.text,
    fontSize: 18,
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
    fontSize: 14,
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

const markStyles = StyleSheet.create({
  unknown: {},
  yes: {
    backgroundColor: "rgba(129,214,197,0.15)",
    borderColor: "rgba(129,214,197,0.4)",
  },
  no: {
    backgroundColor: "rgba(255,176,176,0.12)",
    borderColor: "rgba(255,176,176,0.36)",
  },
  tentative: {
    backgroundColor: "rgba(143,169,255,0.14)",
    borderColor: "rgba(143,169,255,0.4)",
  },
});
