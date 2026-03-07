import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useStudy } from "@/contexts/StudyContext";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeeklyBar({
  minutes,
  maxMinutes,
  day,
  isToday,
}: {
  minutes: number;
  maxMinutes: number;
  day: string;
  isToday: boolean;
}) {
  const { colors } = useTheme();
  const height = maxMinutes > 0 ? Math.max((minutes / maxMinutes) * 100, minutes > 0 ? 10 : 0) : 0;
  const displayTime =
    minutes >= 60 ? `${(minutes / 60).toFixed(1)}h` : minutes > 0 ? `${minutes}m` : "";

  return (
    <View style={styles.barColumn}>
      {displayTime ? (
        <Text style={[styles.barValue, { color: colors.textTertiary, fontFamily: "Satoshi-Medium" }]}>
          {displayTime}
        </Text>
      ) : (
        <View style={{ height: 16 }} />
      )}
      <View style={[styles.barTrack, { backgroundColor: colors.surfaceSecondary }]}>
        {minutes > 0 && (
          <View
            style={[
              styles.barFill,
              {
                height: `${height}%` as any,
                backgroundColor: isToday ? colors.text : colors.textTertiary,
                opacity: isToday ? 1 : 0.5,
              },
            ]}
          />
        )}
      </View>
      <Text
        style={[
          styles.barDay,
          {
            color: isToday ? colors.text : colors.textTertiary,
            fontFamily: isToday ? "Satoshi-Bold" : "Satoshi-Regular",
          },
        ]}
      >
        {day}
      </Text>
    </View>
  );
}

function SubjectRow({
  subject,
  completedSessions,
  totalSessions,
  totalMinutes,
  index,
}: {
  subject: string;
  completedSessions: number;
  totalSessions: number;
  totalMinutes: number;
  index: number;
}) {
  const { colors } = useTheme();
  const percent = totalSessions > 0 ? completedSessions / totalSessions : 0;
  const displayTime =
    totalMinutes >= 60 ? `${(totalMinutes / 60).toFixed(1)}h` : `${totalMinutes}m`;

  return (
    <View style={[styles.subjectRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={styles.subjectInfo}>
        <View style={styles.subjectHeaderRow}>
          <Text style={[styles.subjectName, { color: colors.text, fontFamily: "Satoshi-Medium" }]}>
            {subject}
          </Text>
          <Text style={[styles.subjectMeta, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
            {completedSessions}/{totalSessions} · {displayTime}
          </Text>
        </View>
        <View style={[styles.subjectBar, { backgroundColor: colors.surfaceSecondary }]}>
          <View
            style={[
              styles.subjectBarFill,
              {
                width: `${percent * 100}%`,
                backgroundColor: colors.text,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const { colors } = useTheme();
  const {
    weeklyMinutes,
    subjectProgress,
    streakDays,
    sessions,
  } = useStudy();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const maxWeeklyMinutes = Math.max(...weeklyMinutes, 1);
  const totalWeeklyMinutes = weeklyMinutes.reduce((a, b) => a + b, 0);
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);
  const today = new Date();
  const todayDayIndex = (today.getDay() + 6) % 7;
  const completedSessionsTotal = sessions.filter((s) => s.completed).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 16, paddingBottom: bottomPad + 100 },
        ]}
      >
        <Text style={[styles.pageTitle, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
          Progress
        </Text>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryCardDark, { backgroundColor: colors.text }]}>
            <Feather name="clock" size={16} color={colors.background} />
            <Text style={[styles.summaryValue, { color: colors.background, fontFamily: "Satoshi-Black" }]}>
              {totalWeeklyHours}h
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.background + "99", fontFamily: "Satoshi-Regular" }]}>
              This Week
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="flame-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.summaryValue2, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
              {streakDays}
            </Text>
            <Text style={[styles.summaryLabel2, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
              Streak
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Feather name="check-circle" size={16} color={colors.textSecondary} />
            <Text style={[styles.summaryValue2, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
              {completedSessionsTotal}
            </Text>
            <Text style={[styles.summaryLabel2, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
              Done
            </Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={[styles.weeklyChart, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
              Weekly Activity
            </Text>
            <Text style={[styles.chartSubtitle, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
              {totalWeeklyMinutes > 0 ? `${totalWeeklyHours}h total` : "No data yet"}
            </Text>
          </View>
          <View style={styles.barsRow}>
            {weeklyMinutes.map((minutes, idx) => (
              <WeeklyBar
                key={idx}
                minutes={minutes}
                maxMinutes={maxWeeklyMinutes}
                day={DAY_LABELS[idx]}
                isToday={idx === todayDayIndex}
              />
            ))}
          </View>
        </View>

        {/* Subject Breakdown */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
          Subject Breakdown
        </Text>

        {subjectProgress.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <Feather name="bar-chart-2" size={26} color={colors.textTertiary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
              No data yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
              Generate a study plan and complete sessions to see your progress.
            </Text>
          </View>
        ) : (
          subjectProgress.map((sp, i) => (
            <SubjectRow
              key={sp.subject}
              subject={sp.subject}
              completedSessions={sp.completedSessions}
              totalSessions={sp.totalSessions}
              totalMinutes={sp.totalMinutes}
              index={i}
            />
          ))
        )}

        {/* Streak card */}
        {streakDays >= 1 && (
          <View style={[
            styles.motivationCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}>
            <Ionicons name="flame" size={22} color={colors.text} />
            <View style={styles.motivationContent}>
              <Text style={[styles.motivationTitle, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
                {streakDays === 1 ? "You're on a roll!" : `${streakDays}-day streak`}
              </Text>
              <Text style={[styles.motivationText, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
                Keep studying daily to maintain your streak.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 22 },
  pageTitle: { fontSize: 28, letterSpacing: -0.8, marginBottom: 22 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
  },
  summaryCardDark: { borderWidth: 0 },
  summaryValue: { fontSize: 22 },
  summaryLabel: { fontSize: 11 },
  summaryValue2: { fontSize: 22 },
  summaryLabel2: { fontSize: 11 },
  weeklyChart: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 28,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: { fontSize: 15 },
  chartSubtitle: { fontSize: 13 },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    gap: 6,
  },
  barValue: { fontSize: 9, textAlign: "center" },
  barTrack: {
    width: 26,
    height: 90,
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: { width: "100%", borderRadius: 6 },
  barDay: { fontSize: 11 },
  sectionTitle: { fontSize: 22, letterSpacing: -0.5, marginBottom: 14 },
  subjectRow: {
    padding: 14,
    borderRadius: 13,
    marginBottom: 9,
    borderWidth: 1,
  },
  subjectInfo: { flex: 1 },
  subjectHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subjectName: { fontSize: 14 },
  subjectMeta: { fontSize: 12 },
  subjectBar: { height: 5, borderRadius: 3, overflow: "hidden" },
  subjectBarFill: { height: "100%", borderRadius: 3 },
  emptyState: { alignItems: "center", paddingVertical: 44, gap: 12 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 1,
  },
  emptyTitle: { fontSize: 17 },
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 21, paddingHorizontal: 20 },
  motivationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
  },
  motivationContent: { flex: 1 },
  motivationTitle: { fontSize: 15, marginBottom: 2 },
  motivationText: { fontSize: 13, lineHeight: 18 },
});
