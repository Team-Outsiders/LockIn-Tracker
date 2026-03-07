import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { useStudy, StudySession } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

function SessionCard({ session, onToggle }: { session: StudySession; onToggle: () => void }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(session.completed ? 0.6 : 1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    opacity.value = withTiming(session.completed ? 1 : 0.6, { duration: 200 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const durationText =
    session.duration >= 60
      ? `${Math.floor(session.duration / 60)}h ${session.duration % 60 > 0 ? `${session.duration % 60}m` : ""}`
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
              ? `${Colors.primary}40`
              : colors.cardBorder,
          },
        ]}
      >
        <View
          style={[
            styles.sessionCheck,
            {
              backgroundColor: session.completed
                ? Colors.primary
                : "transparent",
              borderColor: session.completed ? Colors.primary : colors.cardBorder,
            },
          ]}
        >
          {session.completed && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
        <View style={styles.sessionInfo}>
          <Text
            style={[
              styles.sessionSubject,
              {
                color: colors.text,
                fontFamily: "Inter_600SemiBold",
                textDecorationLine: session.completed ? "line-through" : "none",
              },
            ]}
          >
            {session.subject}
          </Text>
          <View style={styles.sessionMeta}>
            <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
            <Text
              style={[
                styles.sessionTime,
                { color: colors.textTertiary, fontFamily: "Inter_400Regular" },
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
                ? `${Colors.primary}15`
                : colors.surfaceSecondary,
            },
          ]}
        >
          <Text
            style={[
              styles.sessionDurationText,
              {
                color: session.completed ? Colors.primary : colors.textSecondary,
                fontFamily: "Inter_600SemiBold",
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

function EmptyState({ colors }: { colors: any }) {
  return (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: `${Colors.primary}15` },
        ]}
      >
        <Ionicons name="calendar-outline" size={32} color={Colors.primary} />
      </View>
      <Text
        style={[
          styles.emptyTitle,
          { color: colors.text, fontFamily: "Inter_600SemiBold" },
        ]}
      >
        No sessions today
      </Text>
      <Text
        style={[
          styles.emptySubtitle,
          { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
        ]}
      >
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
  const dateStr = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

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
          {
            paddingTop: topPad + 16,
            paddingBottom: bottomPad + 100,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.dayText,
                { color: Colors.primary, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              {dayName}
            </Text>
            <Text
              style={[
                styles.dateText,
                { color: colors.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              {dateStr}
            </Text>
          </View>
          <View
            style={[
              styles.streakBadge,
              { backgroundColor: `rgba(245,158,11,0.12)`, borderColor: `rgba(245,158,11,0.3)` },
            ]}
          >
            <Ionicons name="flame" size={16} color="#F59E0B" />
            <Text
              style={[
                styles.streakText,
                { color: "#F59E0B", fontFamily: "Inter_700Bold" },
              ]}
            >
              {streakDays}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={["#14B8A6", "#0D9488"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.statCard, styles.statCardPrimary]}
          >
            <MaterialCommunityIcons name="clock-fast" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={[styles.statCardValue, { fontFamily: "Inter_700Bold" }]}>
              {totalMinutesToday > 0 ? hoursToday : "0m"}
            </Text>
            <Text style={[styles.statCardLabel, { fontFamily: "Inter_400Regular" }]}>
              Studied
            </Text>
          </LinearGradient>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.primary} />
            <Text
              style={[
                styles.statCardValue2,
                { color: colors.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              {completedCount}/{totalCount}
            </Text>
            <Text
              style={[
                styles.statCardLabel2,
                { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              Sessions
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Ionicons name="trophy-outline" size={20} color="#F59E0B" />
            <Text
              style={[
                styles.statCardValue2,
                { color: colors.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              {streakDays}
            </Text>
            <Text
              style={[
                styles.statCardLabel2,
                { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              Streak
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <View
            style={[
              styles.progressSection,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.progressHeader}>
              <Text
                style={[
                  styles.progressLabel,
                  { color: colors.text, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                Daily Progress
              </Text>
              <Text
                style={[
                  styles.progressPercent,
                  { color: Colors.primary, fontFamily: "Inter_700Bold" },
                ]}
              >
                {Math.round(completionPercent * 100)}%
              </Text>
            </View>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: isDark ? "#1E293B" : "#E2E8F0" },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionPercent * 100}%` },
                ]}
              />
            </View>
          </View>
        )}

        {/* Today's Sessions */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, fontFamily: "Inter_700Bold" },
          ]}
        >
          Today's Sessions
        </Text>

        {todaySessions.length === 0 ? (
          <EmptyState colors={colors} />
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
  scrollContent: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayText: { fontSize: 14, marginBottom: 2 },
  dateText: { fontSize: 26, letterSpacing: -0.8 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  streakText: { fontSize: 16 },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
  },
  statCardPrimary: {
    borderWidth: 0,
  },
  statCardValue: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  statCardLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
  },
  statCardValue2: {
    fontSize: 20,
  },
  statCardLabel2: {
    fontSize: 11,
  },
  progressSection: {
    padding: 16,
    borderRadius: 16,
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
  progressPercent: { fontSize: 16 },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#14B8A6",
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  sessionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionInfo: { flex: 1 },
  sessionSubject: { fontSize: 15, marginBottom: 3 },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionTime: { fontSize: 12 },
  sessionDurationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  sessionDurationText: { fontSize: 12 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 18 },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
