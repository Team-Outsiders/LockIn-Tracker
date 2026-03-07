import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { useStudy, StudySession } from "@/contexts/StudyContext";

function SessionCard({
  session,
  onToggle,
}: {
  session: StudySession;
  onToggle: () => void;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const durationText =
    session.duration >= 60
      ? `${Math.floor(session.duration / 60)}h${session.duration % 60 > 0 ? ` ${session.duration % 60}m` : ""}`
      : `${session.duration}m`;

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.sessionCard,
          {
            backgroundColor: colors.card,
            borderColor: session.completed
              ? colors.text + "30"
              : colors.cardBorder,
            opacity: session.completed ? 0.65 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.sessionCheck,
            {
              backgroundColor: session.completed ? colors.text : "transparent",
              borderColor: session.completed ? colors.text : colors.textTertiary,
            },
          ]}
        >
          {session.completed && (
            <Feather name="check" size={11} color={colors.background} />
          )}
        </View>
        <View style={styles.sessionInfo}>
          <Text
            style={[
              styles.sessionSubject,
              {
                color: session.completed ? colors.textTertiary : colors.text,
                fontFamily: "Satoshi-Medium",
                textDecorationLine: session.completed ? "line-through" : "none",
              },
            ]}
          >
            {session.subject}
          </Text>
          <View style={styles.sessionMeta}>
            <Feather name="clock" size={11} color={colors.textTertiary} />
            <Text
              style={[
                styles.sessionTime,
                { color: colors.textTertiary, fontFamily: "Satoshi-Regular" },
              ]}
            >
              {session.startTime} · {durationText}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.sessionDurationBadge,
            {
              backgroundColor: session.completed
                ? colors.text + "10"
                : colors.surface,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.sessionDurationText,
              {
                color: session.completed ? colors.textTertiary : colors.textSecondary,
                fontFamily: "Satoshi-Medium",
              },
            ]}
          >
            {durationText}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function EmptyState() {
  const { colors } = useTheme();
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
        <Feather name="calendar" size={28} color={colors.textTertiary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
        No sessions today
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
        Head to the AI Planner tab to generate your personalized study plan.
      </Text>
    </View>
  );
}

export default function TodayScreen() {
  const { colors, isDark } = useTheme();
  const {
    todaySessions,
    toggleSessionComplete,
    streakDays,
    totalMinutesToday,
  } = useStudy();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  const completedCount = todaySessions.filter((s) => s.completed).length;
  const totalCount = todaySessions.length;
  const completionPercent = totalCount > 0 ? completedCount / totalCount : 0;

  const hoursToday =
    totalMinutesToday >= 60
      ? `${(totalMinutesToday / 60).toFixed(1)}h`
      : `${totalMinutesToday}m`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 16, paddingBottom: bottomPad + 100 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.dayText, { color: colors.textTertiary, fontFamily: "Satoshi-Regular" }]}>
              {dayName}
            </Text>
            <Text style={[styles.dateText, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
              {dateStr}
            </Text>
          </View>
          <View style={[
            styles.streakBadge,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}>
            <Ionicons name="flame" size={14} color={colors.text} />
            <Text style={[styles.streakText, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
              {streakDays}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPrimary, { backgroundColor: colors.text }]}>
            <Feather name="clock" size={16} color={colors.background} />
            <Text style={[styles.statCardValue, { color: colors.background, fontFamily: "Satoshi-Black" }]}>
              {totalMinutesToday > 0 ? hoursToday : "0m"}
            </Text>
            <Text style={[styles.statCardLabel, { color: colors.background + "AA", fontFamily: "Satoshi-Regular" }]}>
              Studied
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Feather name="check-circle" size={16} color={colors.textSecondary} />
            <Text style={[styles.statCardValue2, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
              {completedCount}/{totalCount}
            </Text>
            <Text style={[styles.statCardLabel2, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
              Sessions
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="trophy-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.statCardValue2, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
              {streakDays}
            </Text>
            <Text style={[styles.statCardLabel2, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
              Streak
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <View style={[
            styles.progressSection,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.text, fontFamily: "Satoshi-Medium" }]}>
                Daily Progress
              </Text>
              <Text style={[styles.progressPercent, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
                {Math.round(completionPercent * 100)}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.surfaceSecondary }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionPercent * 100}%`, backgroundColor: colors.text },
                ]}
              />
            </View>
          </View>
        )}

        {/* Sessions */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
          Today's Sessions
        </Text>

        {todaySessions.length === 0 ? (
          <EmptyState />
        ) : (
          todaySessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onToggle={() => toggleSessionComplete(session.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 22 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  dayText: { fontSize: 13, marginBottom: 2 },
  dateText: { fontSize: 28, letterSpacing: -1 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  streakText: { fontSize: 15 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
  },
  statCardPrimary: { borderWidth: 0 },
  statCardValue: { fontSize: 20 },
  statCardLabel: { fontSize: 11 },
  statCardValue2: { fontSize: 20 },
  statCardLabel2: { fontSize: 11 },
  progressSection: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: { fontSize: 14 },
  progressPercent: { fontSize: 14 },
  progressBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  sectionTitle: { fontSize: 22, letterSpacing: -0.5, marginBottom: 14 },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 13,
    marginBottom: 9,
    borderWidth: 1,
    gap: 12,
  },
  sessionCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionInfo: { flex: 1 },
  sessionSubject: { fontSize: 14, marginBottom: 3 },
  sessionMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  sessionTime: { fontSize: 12 },
  sessionDurationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
    borderWidth: 1,
  },
  sessionDurationText: { fontSize: 12 },
  emptyState: { alignItems: "center", paddingVertical: 44, gap: 12 },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 1,
  },
  emptyTitle: { fontSize: 17 },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 20,
  },
});
