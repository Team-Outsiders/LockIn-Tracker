import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { useStudy, StudyPlan, StudySession } from "@/contexts/StudyContext";

const SUBJECT_SUGGESTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
  "History",
  "Computer Science",
  "Economics",
  "Psychology",
  "Spanish",
];

const DURATION_OPTIONS = [25, 45, 60, 90];

function SubjectTag({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.93, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    Haptics.selectionAsync();
    onPress();
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.subjectTag,
          {
            backgroundColor: selected ? colors.text : colors.surface,
            borderColor: selected ? colors.text : colors.cardBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.subjectTagText,
            {
              color: selected ? colors.background : colors.textSecondary,
              fontFamily: selected ? "Satoshi-Medium" : "Satoshi-Regular",
            },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function PlanSessionPreview({ session, index }: { session: StudySession; index: number }) {
  const { colors } = useTheme();
  const PALETTE = ["#888", "#777", "#999", "#666", "#aaa", "#555", "#bbb"];
  const color = PALETTE[index % PALETTE.length];

  const durationText =
    session.duration >= 60
      ? `${Math.floor(session.duration / 60)}h${session.duration % 60 > 0 ? ` ${session.duration % 60}m` : ""}`
      : `${session.duration}m`;

  return (
    <View style={[styles.planSessionItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
      <View style={[styles.planDot, { backgroundColor: colors.textTertiary }]} />
      <View style={styles.planSessionInfo}>
        <Text style={[styles.planSessionSubject, { color: colors.text, fontFamily: "Satoshi-Medium" }]}>
          {session.subject}
        </Text>
        <Text style={[styles.planSessionTime, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
          {session.startTime} · {durationText}
        </Text>
      </View>
      <View style={[styles.planSessionBadge, { backgroundColor: colors.surfaceSecondary, borderColor: colors.cardBorder }]}>
        <Text style={[styles.planSessionBadgeText, { color: colors.textSecondary, fontFamily: "Satoshi-Medium" }]}>
          {durationText}
        </Text>
      </View>
    </View>
  );
}

function generateStudyPlan(
  subjects: string[],
  goal: string,
  dailyHours: number,
  sessionDuration: number,
  daysAhead: number
): StudyPlan {
  const sessions: StudySession[] = [];
  const today = new Date();
  const sessionsPerDay = Math.max(1, Math.floor((dailyHours * 60) / sessionDuration));

  for (let day = 0; day < daysAhead; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];
    let hour = 9;
    let minute = 0;

    for (let i = 0; i < sessionsPerDay; i++) {
      const subject = subjects[(day * sessionsPerDay + i) % subjects.length];
      const startTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

      sessions.push({
        id: `${Date.now()}-${day}-${i}-${Math.random().toString(36).substr(2, 6)}`,
        subject,
        duration: sessionDuration,
        startTime,
        completed: false,
        date: dateStr,
      });

      minute += sessionDuration + 15;
      while (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute = minute % 60;
      }
    }
  }

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    goal,
    subjects,
    sessions,
  };
}

export default function PlannerScreen() {
  const { colors } = useTheme();
  const { setActivePlan, activePlan } = useStudy();
  const insets = useSafeAreaInsets();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");
  const [goal, setGoal] = useState("");
  const [dailyHours, setDailyHours] = useState(2);
  const [sessionDuration, setSessionDuration] = useState(45);
  const [daysAhead, setDaysAhead] = useState(7);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateButtonScale = useSharedValue(1);
  const spinValue = useSharedValue(0);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const addCustomSubject = () => {
    const trimmed = customSubject.trim();
    if (trimmed && !selectedSubjects.includes(trimmed)) {
      setSelectedSubjects((prev) => [...prev, trimmed]);
      setCustomSubject("");
    }
  };

  const handleGenerate = async () => {
    if (selectedSubjects.length === 0) {
      Alert.alert("Select Subjects", "Please select at least one subject.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsGenerating(true);
    generateButtonScale.value = withSpring(0.96);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const plan = generateStudyPlan(selectedSubjects, goal || "Master selected subjects", dailyHours, sessionDuration, daysAhead);
    setGeneratedPlan(plan);
    setIsGenerating(false);
    generateButtonScale.value = withSpring(1);
  };

  const handleApplyPlan = async () => {
    if (!generatedPlan) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setActivePlan(generatedPlan);
    setGeneratedPlan(null);
    Alert.alert("Plan Applied", "Your study plan is now active. Check the Today tab.");
  };

  const todaySessions = generatedPlan
    ? generatedPlan.sessions.filter((s) => s.date === new Date().toISOString().split("T")[0])
    : [];

  const generateBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: generateButtonScale.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 16, paddingBottom: bottomPad + 100 },
        ]}
      >
        {/* Header */}
        <Text style={[styles.pageTitle, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
          AI Planner
        </Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
          Build your personalized study schedule
        </Text>

        {/* Active Plan Notice */}
        {activePlan && !generatedPlan && (
          <View style={[styles.activePlanBanner, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Feather name="check-circle" size={14} color={colors.textSecondary} />
            <Text style={[styles.activePlanText, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
              Active plan · {activePlan.subjects.join(", ")}
            </Text>
          </View>
        )}

        {/* Goal */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
            Your Goal
          </Text>
          <TextInput
            value={goal}
            onChangeText={setGoal}
            placeholder="e.g. Prepare for finals in 2 weeks"
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.textInput,
              { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text, fontFamily: "Satoshi-Regular" },
            ]}
            multiline
          />
        </View>

        {/* Subjects */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
            Subjects {selectedSubjects.length > 0 ? `(${selectedSubjects.length})` : ""}
          </Text>
          <View style={styles.subjectTagsWrap}>
            {SUBJECT_SUGGESTIONS.map((s) => (
              <SubjectTag key={s} label={s} selected={selectedSubjects.includes(s)} onPress={() => toggleSubject(s)} />
            ))}
            {selectedSubjects.filter((s) => !SUBJECT_SUGGESTIONS.includes(s)).map((s) => (
              <SubjectTag key={s} label={s} selected={true} onPress={() => toggleSubject(s)} />
            ))}
          </View>
          <View style={styles.customInputRow}>
            <TextInput
              value={customSubject}
              onChangeText={setCustomSubject}
              placeholder="Add subject..."
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.customInput,
                { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text, fontFamily: "Satoshi-Regular" },
              ]}
              onSubmitEditing={addCustomSubject}
              returnKeyType="done"
            />
            <Pressable onPress={addCustomSubject} style={[styles.addBtn, { backgroundColor: colors.text }]}>
              <Feather name="plus" size={20} color={colors.background} />
            </Pressable>
          </View>
        </View>

        {/* Daily Hours */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
            Daily Hours: {dailyHours}h
          </Text>
          <View style={styles.optionRow}>
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <Pressable
                key={h}
                onPress={() => { setDailyHours(h); Haptics.selectionAsync(); }}
                style={[
                  styles.optionPill,
                  { backgroundColor: dailyHours === h ? colors.text : colors.card, borderColor: dailyHours === h ? colors.text : colors.cardBorder },
                ]}
              >
                <Text style={[styles.optionPillText, { color: dailyHours === h ? colors.background : colors.textSecondary, fontFamily: dailyHours === h ? "Satoshi-Bold" : "Satoshi-Regular" }]}>
                  {h}h
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Session Duration */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
            Session Length: {sessionDuration}m
          </Text>
          <View style={styles.optionRow}>
            {DURATION_OPTIONS.map((d) => (
              <Pressable
                key={d}
                onPress={() => { setSessionDuration(d); Haptics.selectionAsync(); }}
                style={[
                  styles.optionPill,
                  { backgroundColor: sessionDuration === d ? colors.text : colors.card, borderColor: sessionDuration === d ? colors.text : colors.cardBorder },
                ]}
              >
                <Text style={[styles.optionPillText, { color: sessionDuration === d ? colors.background : colors.textSecondary, fontFamily: sessionDuration === d ? "Satoshi-Bold" : "Satoshi-Regular" }]}>
                  {d}m
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Days Ahead */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
            Plan Duration: {daysAhead} days
          </Text>
          <View style={styles.optionRow}>
            {[3, 5, 7, 14, 21, 30].map((d) => (
              <Pressable
                key={d}
                onPress={() => { setDaysAhead(d); Haptics.selectionAsync(); }}
                style={[
                  styles.optionPill,
                  { backgroundColor: daysAhead === d ? colors.text : colors.card, borderColor: daysAhead === d ? colors.text : colors.cardBorder },
                ]}
              >
                <Text style={[styles.optionPillText, { color: daysAhead === d ? colors.background : colors.textSecondary, fontFamily: daysAhead === d ? "Satoshi-Bold" : "Satoshi-Regular" }]}>
                  {d}d
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <Animated.View style={generateBtnStyle}>
          <Pressable
            onPress={handleGenerate}
            disabled={isGenerating}
            style={[styles.generateBtn, { backgroundColor: colors.text, opacity: isGenerating ? 0.7 : 1 }]}
          >
            <Feather name={isGenerating ? "loader" : "cpu"} size={18} color={colors.background} />
            <Text style={[styles.generateBtnText, { color: colors.background, fontFamily: "Satoshi-Bold" }]}>
              {isGenerating ? "Generating..." : "Generate Study Plan"}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Generated Plan Preview */}
        {generatedPlan && (
          <View style={[styles.planPreview, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.planPreviewHeader}>
              <View>
                <Text style={[styles.planPreviewTitle, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
                  Plan Ready
                </Text>
                <Text style={[styles.planPreviewSubtitle, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
                  {generatedPlan.sessions.length} sessions · {daysAhead} days
                </Text>
              </View>
              <View style={[styles.planReadyBadge, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                <Feather name="cpu" size={12} color={colors.textSecondary} />
                <Text style={[styles.planReadyText, { color: colors.textSecondary, fontFamily: "Satoshi-Medium" }]}>
                  AI
                </Text>
              </View>
            </View>

            <Text style={[styles.planDayLabel, { color: colors.textSecondary, fontFamily: "Satoshi-Medium" }]}>
              Today's sessions ({todaySessions.length})
            </Text>

            {todaySessions.length > 0 ? (
              todaySessions.map((s, i) => (
                <PlanSessionPreview key={s.id} session={s} index={i} />
              ))
            ) : (
              <Text style={[styles.noSessionsText, { color: colors.textTertiary, fontFamily: "Satoshi-Regular" }]}>
                No sessions scheduled for today
              </Text>
            )}

            <View style={styles.planActions}>
              <Pressable
                onPress={() => setGeneratedPlan(null)}
                style={[styles.discardBtn, { borderColor: colors.cardBorder, backgroundColor: colors.surface }]}
              >
                <Text style={[styles.discardBtnText, { color: colors.textSecondary, fontFamily: "Satoshi-Medium" }]}>
                  Discard
                </Text>
              </Pressable>
              <Pressable
                onPress={handleApplyPlan}
                style={[styles.applyBtn, { backgroundColor: colors.text, flex: 2 }]}
              >
                <Text style={[styles.applyBtnText, { color: colors.background, fontFamily: "Satoshi-Bold" }]}>
                  Apply Plan
                </Text>
                <Feather name="check" size={16} color={colors.background} />
              </Pressable>
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
  pageTitle: { fontSize: 28, letterSpacing: -0.8, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, marginBottom: 22 },
  activePlanBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 22,
  },
  activePlanText: { fontSize: 13, flex: 1 },
  section: { marginBottom: 22 },
  sectionLabel: { fontSize: 15, marginBottom: 10 },
  textInput: {
    borderWidth: 1,
    borderRadius: 13,
    padding: 14,
    fontSize: 14,
    minHeight: 52,
  },
  subjectTagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  subjectTag: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  subjectTagText: { fontSize: 13 },
  customInputRow: { flexDirection: "row", gap: 8 },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionPillText: { fontSize: 13 },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
    borderRadius: 14,
    marginBottom: 20,
  },
  generateBtnText: { fontSize: 16 },
  planPreview: { borderRadius: 18, borderWidth: 1, padding: 18 },
  planPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  planPreviewTitle: { fontSize: 17, marginBottom: 3 },
  planPreviewSubtitle: { fontSize: 13 },
  planReadyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  planReadyText: { fontSize: 12 },
  planDayLabel: { fontSize: 13, marginBottom: 10 },
  planSessionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 11,
    marginBottom: 8,
    borderWidth: 1,
    gap: 10,
  },
  planDot: { width: 7, height: 7, borderRadius: 4 },
  planSessionInfo: { flex: 1 },
  planSessionSubject: { fontSize: 14, marginBottom: 2 },
  planSessionTime: { fontSize: 12 },
  planSessionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  planSessionBadgeText: { fontSize: 12 },
  noSessionsText: { fontSize: 13, textAlign: "center", paddingVertical: 8 },
  planActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  discardBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
  },
  discardBtnText: { fontSize: 14 },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 13,
  },
  applyBtnText: { fontSize: 14 },
});
