import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { palette, radii } from "../lib/theme";

export type PagerItem = {
  id: string;
  label: string;
  meta?: string;
  stateLabel?: string;
};

type PagerControlsProps = {
  items: PagerItem[];
  index: number;
  onChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  getHref?: (index: number) => string;
};

export function PagerControls({
  items,
  index,
  onChange,
  style,
  getHref,
}: PagerControlsProps) {
  if (!items.length) {
    return null;
  }

  const safeIndex = Math.min(Math.max(index, 0), items.length - 1);
  const current = items[safeIndex];
  const visibleIndexes = getVisibleIndexes(items.length, safeIndex);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.label} numberOfLines={1}>
            {current.label}
          </Text>
          {current.meta ? (
            <Text style={styles.meta} numberOfLines={1}>
              {current.meta}
            </Text>
          ) : null}
        </View>
        <View style={styles.counterWrap}>
          {current.stateLabel ? <Text style={styles.stateLabel}>{current.stateLabel}</Text> : null}
          <Text style={styles.counter}>
            {safeIndex + 1}/{items.length}
          </Text>
        </View>
      </View>

      <View style={styles.controlRow}>
        <PagerButton
          label="前"
          disabled={safeIndex === 0}
          onPress={() => onChange(safeIndex - 1)}
          href={safeIndex === 0 || !getHref ? undefined : getHref(safeIndex - 1)}
        />
        <View style={styles.dotRow}>
          {visibleIndexes.map((visibleIndex, position) =>
            visibleIndex === -1 ? (
              <Text key={`ellipsis-${safeIndex}-${position}`} style={styles.ellipsis}>
                …
              </Text>
            ) : (
              <PagerDot
                key={items[visibleIndex].id}
                active={visibleIndex === safeIndex}
                label={String(visibleIndex + 1)}
                onPress={() => onChange(visibleIndex)}
                href={getHref ? getHref(visibleIndex) : undefined}
              />
            ),
          )}
        </View>
        <PagerButton
          label="次"
          disabled={safeIndex === items.length - 1}
          onPress={() => onChange(safeIndex + 1)}
          href={safeIndex === items.length - 1 || !getHref ? undefined : getHref(safeIndex + 1)}
        />
      </View>
    </View>
  );
}

function PagerButton({
  label,
  disabled,
  onPress,
  href,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
  href?: string;
}) {
  if (href && !disabled) {
    return (
      <Link href={href}>
        <View style={styles.pageButton}>
          <Text style={styles.pageButtonText}>{label}</Text>
        </View>
      </Link>
    );
  }

  return (
    <Pressable
      disabled={disabled}
      style={[styles.pageButton, disabled && styles.pageButtonDisabled]}
      onPress={onPress}
    >
      <Text style={[styles.pageButtonText, disabled && styles.pageButtonTextDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

function PagerDot({
  active,
  label,
  onPress,
  href,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  href?: string;
}) {
  const content = (
    <Pressable
      style={StyleSheet.flatten([styles.dotButton, active && styles.dotButtonActive])}
      onPress={href ? undefined : onPress}
    >
      <Text style={[styles.dotText, active && styles.dotTextActive]}>{label}</Text>
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href}>
        <View style={StyleSheet.flatten([styles.dotButton, active && styles.dotButtonActive])}>
          <Text style={[styles.dotText, active && styles.dotTextActive]}>{label}</Text>
        </View>
      </Link>
    );
  }

  return content;
}

function getVisibleIndexes(length: number, currentIndex: number): number[] {
  if (length <= 5) {
    return Array.from({ length }, (_, index) => index);
  }

  const indexes = new Set<number>();
  indexes.add(0);
  indexes.add(length - 1);
  indexes.add(currentIndex);
  if (currentIndex - 1 > 0) {
    indexes.add(currentIndex - 1);
  }
  if (currentIndex + 1 < length - 1) {
    indexes.add(currentIndex + 1);
  }

  const sorted = Array.from(indexes).sort((left, right) => left - right);
  const visible: number[] = [];

  sorted.forEach((value, position) => {
    if (position > 0 && value - sorted[position - 1] > 1) {
      visible.push(-1);
    }
    visible.push(value);
  });

  return visible;
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  label: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  meta: {
    color: palette.muted,
    fontSize: 12,
  },
  counterWrap: {
    alignItems: "flex-end",
    gap: 4,
  },
  stateLabel: {
    color: palette.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  counter: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  pageButtonDisabled: {
    opacity: 0.45,
  },
  pageButtonText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "700",
  },
  pageButtonTextDisabled: {
    color: palette.muted,
  },
  dotRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  dotButton: {
    minWidth: 24,
    height: 24,
    borderRadius: 999,
    paddingHorizontal: 7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  dotButtonActive: {
    backgroundColor: "rgba(242,198,109,0.16)",
    borderColor: "rgba(242,198,109,0.45)",
  },
  dotText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  dotTextActive: {
    color: palette.text,
  },
  ellipsis: {
    color: palette.muted,
    fontSize: 16,
    lineHeight: 20,
  },
});
