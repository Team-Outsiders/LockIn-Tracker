import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeeklyBar({ minutes, maxMinutes, day, isToday }: {
  minutes: number;
  maxMinutes: number;
  day: string;
  isToday: boolean;
}) {
  const { colors } = useTheme();
  const height = maxMinutes > 0 ? Math.max((minutes / maxMinutes) * 100, minutes > 0 ? 8 : 0) : 0;
  const displayTime = minutes >= 60 ? `${(minutes / 60).toFixed(1)}h` : minutes > 0 ? `${minutes}m` : "";

  return (
    <View style={styles.barColumn}>
      {displayTime ? (
        <Text style={[styles.barValue, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
          {displayTime}
        </Text>
      ) : <View style={{ height: 18 }} />}
      <View style={[styles.barTrack, { backgroundColor: colors.surfaceSecondary }]}>
        {minutes > 0 && (
          <LinearGradient
            colors={isToday ? ["#14B8A6", "#0D9488"] : ["#14B8A640", "#0D948840"]}
            style={[styles.barFill, { height: `${height}%` as any }]}
          />
        )}
      </View>
      <Text style={[
        styles.barDay,
        {
          color: isToday ? Colors.primary : colors.textTertiary,
          fontFamily: isToday ? "Inter_600SemiBold" : "Inter_400Regular",
        }
      ]}>
        {day}
      </Text>
    </View>
  );
}

function SubjectRow({ subject, color, completedSessions, totalSessions, totalMinutes }: {
  subject: string;
  color: string;
  completedSessions: number;
  totalSessions: number;
  totalMinutes: number;
}) {
  const { colors } = useTheme();
  const percent = totalSessions > 0 ? completedSessions / totalSessions : 0;
  const displayTime = totalMinutes >= 60
    ? `${(totalMinutes / 60).toFixed(1)}h`
    : `${totalMinutes}m`;

  return (
    <View style={[styles.subjectRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={[styles.subjectColorDot, { backgroundColor: color }]} />
      <View style={styles.subjectInfo}>
        <View style={styles.subjectHeaderRow}>
          <Text style={[styles.subjectName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            {subject}
          </Text>
          <Text style={[styles.subjectMeta, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {completedSessions}/{totalSessions} · {displayTime}
          </Text>
        </View>
        <View style={[styles.subjectBar, { backgroundColor: colors.surfaceSecondary }]}>
          <View style={[styles.subjectBarFill, { width: `${percent * 100}%`, backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const { colors, isDark } = useTheme();
  const { weeklyMinutes, subjectProgress, streakDays, totalMinutesToday, todaySessions, sessions } = useStudy();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const maxWeeklyMinutes = Math.max(...weeklyMinutes, 1);
  const totalWeeklyMinutes = weeklyMinutes.reduce((a, b) => a + b, 0);
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);

  const today = new Date();
  const todayDayIndex = (today.getDay() + 6) % 7;

  const completedSessionsTotal = sessions.filter((s) => s.completed).length;
  const totalSessionsAll = sessions.length;

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
        <Text style={[styles.pageTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Progress
        </Text>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <LinearGradient
            colors={["#14B8A6", "#0D9488"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.summaryCard, styles.summaryCardPrimary]}
          >
            <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={[styles.summaryValue, { fontFamily: "Inter_700Bold" }]}>
              {totalWeeklyHours}h
            </Text>
            <Text style={[styles.summaryLabel, { fontFamily: "Inter_400Regular" }]}>
              This Week
            </Text>
          </LinearGradient>

          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="flame-outline" size={20} color="#F59E0B" />
            <Text style={[styles.summaryValue2, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              {streakDays}
            </Text>
            <Text style={[styles.summaryLabel2, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Day Streak
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="checkmark-done-outline" size={20} color="#8B5CF6" />
            <Text style={[styles.summaryValue2, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              {completedSessionsTotal}
            </Text>
            <Text style={[styles.summaryLabel2, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Sessions
            </Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={[styles.weeklyChart, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Weekly Activity
            </Text>
            <Text style={[styles.chartSubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
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
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Subject Breakdown
        </Text>

        {subjectProgress.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: `${Colors.primary}12` }]}>
              <Ionicons name="bar-chart-outline" size={30} color={Colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              No data yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Generate a study plan and complete sessions to see your progress here.
            </Text>
          </View>
        ) : (
          subjectProgress.map((sp) => (
            <SubjectRow
              key={sp.subject}
              subject={sp.subject}
              color={sp.color}
              completedSessions={sp.completedSessions}
              totalSessions={sp.totalSessions}
              totalMinutes={sp.totalMinutes}
            />
          ))
        )}

        {/* Motivation Card */}
        {streakDays >= 1 && (
          <View style={[
            styles.motivationCard,
            {
              backgroundColor: isDark ? "rgba(245,158,11,0.08)" : "rgba(245,158,11,0.06)",
              borderColor: "rgba(245,158,11,0.25)",
            }
          ]}>
            <Ionicons name="flame" size={24} color="#F59E0B" />
            <View style={styles.motivationContent}>
              <Text style={[styles.motivationTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                {streakDays === 1 ? "You're on a roll!" : `${streakDays}-day streak!`}
              </Text>
              <Text style={[styles.motivationText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
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
  scrollContent: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 28, letterSpacing: -0.8, marginBottom: 20 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
  },
  summaryCardPrimary: { borderWidth: 0 },
  summaryValue: { fontSize: 22, color: "#FFFFFF" },
  summaryLabel: { fontSize: 11, color: "rgba(255,255,255,0.75)" },
  summaryValue2: { fontSize: 22 },
  summaryLabel2: { fontSize: 11 },
  weeklyChart: {
    borderRadius: 20,
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
  barValue: { fontSize: 10, textAlign: "center" },
  barTrack: {
    width: 28,
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderRadius: 8,
  },
  barDay: { fontSize: 11 },
  sectionTitle: { fontSize: 20, letterSpacing: -0.5, marginBottom: 14 },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  subjectColorDot: { width: 10, height: 10, borderRadius: 5 },
  subjectInfo: { flex: 1 },
  subjectHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectName: { fontSize: 14 },
  subjectMeta: { fontSize: 12 },
  subjectBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  subjectBarFill: { height: "100%", borderRadius: 3 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 17 },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  motivationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
  },
  motivationContent: { flex: 1 },
  motivationTitle: { fontSize: 15, marginBottom: 2 },
  motivationText: { fontSize: 13, lineHeight: 18 },
});
