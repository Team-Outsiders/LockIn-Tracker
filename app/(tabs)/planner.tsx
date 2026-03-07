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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
import Colors from "@/constants/colors";

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
  color,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.92, { damping: 15 }, () => {
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
            backgroundColor: selected
              ? `${Colors.primary}20`
              : colors.surface,
            borderColor: selected ? Colors.primary : colors.cardBorder,
          },
        ]}
      >
        {selected && (
          <Ionicons name="checkmark" size={12} color={Colors.primary} />
        )}
        <Text
          style={[
            styles.subjectTagText,
            {
              color: selected ? Colors.primary : colors.textSecondary,
              fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
            },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function PlanSessionPreview({
  session,
  index,
}: {
  session: StudySession;
  index: number;
}) {
  const { colors } = useTheme();
  const COLORS = [
    "#14B8A6",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#3B82F6",
    "#10B981",
    "#EC4899",
  ];
  const color = COLORS[index % COLORS.length];

  const durationText =
    session.duration >= 60
      ? `${Math.floor(session.duration / 60)}h ${session.duration % 60 > 0 ? `${session.duration % 60}m` : ""}`
      : `${session.duration}m`;

  return (
    <View
      style={[
        styles.planSessionItem,
        { backgroundColor: colors.surface, borderColor: colors.cardBorder },
      ]}
    >
      <View style={[styles.planDot, { backgroundColor: color }]} />
      <View style={styles.planSessionInfo}>
        <Text
          style={[
            styles.planSessionSubject,
            { color: colors.text, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          {session.subject}
        </Text>
        <Text
          style={[
            styles.planSessionTime,
            { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
          ]}
        >
          {session.startTime} · {durationText}
        </Text>
      </View>
      <View
        style={[
          styles.planSessionBadge,
          { backgroundColor: `${color}15` },
        ]}
      >
        <Text
          style={[
            styles.planSessionBadgeText,
            { color, fontFamily: "Inter_500Medium" },
          ]}
        >
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

  const sessionsPerDay = Math.floor((dailyHours * 60) / sessionDuration);
  const subjectRotation = [...subjects];

  for (let day = 0; day < daysAhead; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];

    let hour = 9;
    let minute = 0;

    for (let i = 0; i < sessionsPerDay; i++) {
      const subject = subjectRotation[(day * sessionsPerDay + i) % subjectRotation.length];
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
  const { colors, isDark } = useTheme();
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
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      setSelectedSubjects((prev) => [...prev, customSubject.trim()]);
      setCustomSubject("");
    }
  };

  const handleGenerate = async () => {
    if (selectedSubjects.length === 0) {
      Alert.alert("Add Subjects", "Please select at least one subject to study.");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsGenerating(true);
    generateButtonScale.value = withSpring(0.96);

    await new Promise((resolve) => setTimeout(resolve, 1400));

    const plan = generateStudyPlan(
      selectedSubjects,
      goal || "Master selected subjects",
      dailyHours,
      sessionDuration,
      daysAhead
    );

    setGeneratedPlan(plan);
    setIsGenerating(false);
    generateButtonScale.value = withSpring(1);
  };

  const handleApplyPlan = async () => {
    if (!generatedPlan) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setActivePlan(generatedPlan);
    setGeneratedPlan(null);
    Alert.alert("Plan Applied!", "Your study plan is now active. Check the Today tab to see today's sessions.");
  };

  const todaySessions = generatedPlan
    ? generatedPlan.sessions.filter(
        (s) => s.date === new Date().toISOString().split("T")[0]
      )
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
        <View style={styles.header}>
          <View
            style={[
              styles.headerIcon,
              { backgroundColor: `${Colors.primary}15` },
            ]}
          >
            <MaterialCommunityIcons
              name="brain"
              size={20}
              color={Colors.primary}
            />
          </View>
          <View>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              AI Planner
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              Build your personalized study plan
            </Text>
          </View>
        </View>

        {/* Active Plan Notice */}
        {activePlan && !generatedPlan && (
          <View
            style={[
              styles.activePlanBanner,
              {
                backgroundColor: `${Colors.primary}10`,
                borderColor: `${Colors.primary}30`,
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
            <Text
              style={[
                styles.activePlanText,
                { color: Colors.primary, fontFamily: "Inter_500Medium" },
              ]}
            >
              You have an active plan · {activePlan.subjects.join(", ")}
            </Text>
          </View>
        )}

        {/* Goal Input */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Your Goal
          </Text>
          <TextInput
            value={goal}
            onChangeText={setGoal}
            placeholder="e.g. Prepare for final exams in 2 weeks"
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.textInput,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
                color: colors.text,
                fontFamily: "Inter_400Regular",
              },
            ]}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Subjects */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Subjects {selectedSubjects.length > 0 && `(${selectedSubjects.length})`}
          </Text>
          <View style={styles.subjectTagsWrap}>
            {SUBJECT_SUGGESTIONS.map((s) => (
              <SubjectTag
                key={s}
                label={s}
                selected={selectedSubjects.includes(s)}
                onPress={() => toggleSubject(s)}
              />
            ))}
          </View>

          {selectedSubjects.filter((s) => !SUBJECT_SUGGESTIONS.includes(s)).map((s) => (
            <SubjectTag
              key={s}
              label={s}
              selected={true}
              onPress={() => toggleSubject(s)}
            />
          ))}

          <View style={styles.customInputRow}>
            <TextInput
              value={customSubject}
              onChangeText={setCustomSubject}
              placeholder="Add custom subject..."
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.customInput,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  color: colors.text,
                  fontFamily: "Inter_400Regular",
                },
              ]}
              onSubmitEditing={addCustomSubject}
              returnKeyType="done"
            />
            <Pressable
              onPress={addCustomSubject}
              style={[
                styles.addBtn,
                { backgroundColor: Colors.primary },
              ]}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* Daily Hours */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Daily Study Hours: {dailyHours}h
          </Text>
          <View style={styles.optionRow}>
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <Pressable
                key={h}
                onPress={() => { setDailyHours(h); Haptics.selectionAsync(); }}
                style={[
                  styles.optionPill,
                  {
                    backgroundColor:
                      dailyHours === h ? Colors.primary : colors.card,
                    borderColor:
                      dailyHours === h ? Colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    {
                      color: dailyHours === h ? "#FFFFFF" : colors.textSecondary,
                      fontFamily:
                        dailyHours === h ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {h}h
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Session Duration */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Session Duration: {sessionDuration}m
          </Text>
          <View style={styles.optionRow}>
            {DURATION_OPTIONS.map((d) => (
              <Pressable
                key={d}
                onPress={() => { setSessionDuration(d); Haptics.selectionAsync(); }}
                style={[
                  styles.optionPill,
                  {
                    backgroundColor:
                      sessionDuration === d ? Colors.primary : colors.card,
                    borderColor:
                      sessionDuration === d ? Colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    {
                      color:
                        sessionDuration === d ? "#FFFFFF" : colors.textSecondary,
                      fontFamily:
                        sessionDuration === d ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {d}m
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Days Ahead */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.text, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Plan Duration: {daysAhead} days
          </Text>
          <View style={styles.optionRow}>
            {[3, 5, 7, 14, 21, 30].map((d) => (
              <Pressable
                key={d}
                onPress={() => { setDaysAhead(d); Haptics.selectionAsync(); }}
                style={[
                  styles.optionPill,
                  {
                    backgroundColor:
                      daysAhead === d ? Colors.primary : colors.card,
                    borderColor:
                      daysAhead === d ? Colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    {
                      color: daysAhead === d ? "#FFFFFF" : colors.textSecondary,
                      fontFamily:
                        daysAhead === d ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {d}d
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <Animated.View style={generateBtnStyle}>
          <Pressable onPress={handleGenerate} disabled={isGenerating}>
            <LinearGradient
              colors={["#14B8A6", "#0D9488"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.generateBtn,
                { opacity: isGenerating ? 0.8 : 1 },
              ]}
            >
              {isGenerating ? (
                <>
                  <MaterialCommunityIcons
                    name="loading"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text
                    style={[
                      styles.generateBtnText,
                      { fontFamily: "Inter_700Bold" },
                    ]}
                  >
                    Generating Plan...
                  </Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="brain"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text
                    style={[
                      styles.generateBtnText,
                      { fontFamily: "Inter_700Bold" },
                    ]}
                  >
                    Generate Study Plan
                  </Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Generated Plan Preview */}
        {generatedPlan && (
          <View
            style={[
              styles.planPreview,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(20,184,166,0.12)", "transparent"]
                  : ["rgba(20,184,166,0.06)", "transparent"]
              }
              style={styles.planPreviewGradient}
            >
              <View style={styles.planPreviewHeader}>
                <View>
                  <Text
                    style={[
                      styles.planPreviewTitle,
                      { color: colors.text, fontFamily: "Inter_700Bold" },
                    ]}
                  >
                    Your Plan is Ready
                  </Text>
                  <Text
                    style={[
                      styles.planPreviewSubtitle,
                      {
                        color: colors.textSecondary,
                        fontFamily: "Inter_400Regular",
                      },
                    ]}
                  >
                    {generatedPlan.sessions.length} sessions · {daysAhead} days
                  </Text>
                </View>
                <View
                  style={[
                    styles.planReadyBadge,
                    { backgroundColor: `${Colors.primary}15` },
                  ]}
                >
                  <Ionicons name="sparkles" size={14} color={Colors.primary} />
                  <Text
                    style={[
                      styles.planReadyText,
                      { color: Colors.primary, fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    AI
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.planDayLabel,
                  { color: colors.textSecondary, fontFamily: "Inter_500Medium" },
                ]}
              >
                Today's sessions ({todaySessions.length})
              </Text>

              {todaySessions.length > 0 ? (
                todaySessions.map((s, i) => (
                  <PlanSessionPreview key={s.id} session={s} index={i} />
                ))
              ) : (
                <Text
                  style={[
                    styles.noSessionsText,
                    {
                      color: colors.textTertiary,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                >
                  No sessions scheduled for today
                </Text>
              )}

              <View style={styles.planActions}>
                <Pressable
                  onPress={() => setGeneratedPlan(null)}
                  style={[
                    styles.discardBtn,
                    {
                      borderColor: colors.cardBorder,
                      backgroundColor: colors.surface,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.discardBtnText,
                      {
                        color: colors.textSecondary,
                        fontFamily: "Inter_600SemiBold",
                      },
                    ]}
                  >
                    Discard
                  </Text>
                </Pressable>
                <Pressable onPress={handleApplyPlan} style={styles.applyBtnWrap}>
                  <LinearGradient
                    colors={["#14B8A6", "#0D9488"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.applyBtn}
                  >
                    <Text
                      style={[
                        styles.applyBtnText,
                        { fontFamily: "Inter_700Bold" },
                      ]}
                    >
                      Apply Plan
                    </Text>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
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
    gap: 14,
    marginBottom: 20,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 24, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, marginTop: 1 },
  activePlanBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  activePlanText: { fontSize: 13, flex: 1 },
  section: { marginBottom: 22 },
  sectionLabel: { fontSize: 15, marginBottom: 10 },
  textInput: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    minHeight: 52,
  },
  subjectTagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  subjectTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  subjectTagText: { fontSize: 13 },
  customInputRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
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
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
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
    borderRadius: 16,
    marginBottom: 20,
  },
  generateBtnText: { color: "#FFFFFF", fontSize: 17 },
  planPreview: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  planPreviewGradient: { padding: 20 },
  planPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  planPreviewTitle: { fontSize: 18, marginBottom: 3 },
  planPreviewSubtitle: { fontSize: 13 },
  planReadyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  planReadyText: { fontSize: 12 },
  planDayLabel: { fontSize: 13, marginBottom: 10 },
  planSessionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    gap: 10,
  },
  planDot: { width: 8, height: 8, borderRadius: 4 },
  planSessionInfo: { flex: 1 },
  planSessionSubject: { fontSize: 14, marginBottom: 2 },
  planSessionTime: { fontSize: 12 },
  planSessionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  planSessionBadgeText: { fontSize: 12 },
  noSessionsText: { fontSize: 13, textAlign: "center", paddingVertical: 8 },
  planActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  discardBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  discardBtnText: { fontSize: 15 },
  applyBtnWrap: { flex: 2 },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  applyBtnText: { color: "#FFFFFF", fontSize: 15 },
});
