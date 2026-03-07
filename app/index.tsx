import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 22, stiffness: 100 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        styles.featureCard,
        { backgroundColor: colors.card, borderColor: colors.cardBorder },
      ]}
    >
      <View style={[styles.featureIconWrap, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
        {icon}
      </View>
      <View style={styles.featureTextWrap}>
        <Text style={[styles.featureTitle, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
          {title}
        </Text>
        <Text style={[styles.featureDesc, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
          {description}
        </Text>
      </View>
    </Animated.View>
  );
}

function StatBadge({ value, label, delay }: { value: string; label: string; delay: number }) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 18 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animStyle, styles.statBadge, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
      <Text style={[styles.statValue, { color: colors.highlight, fontFamily: "Satoshi-Black" }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
        {label}
      </Text>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(32);
  const buttonScale = useSharedValue(1);
  const glowPulse = useSharedValue(0.4);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 700 });
    heroTranslateY.value = withSpring(0, { damping: 22, stiffness: 80 });
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({ opacity: glowPulse.value }));
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));

  const handleGetStarted = () => {
    buttonScale.value = withSequence(
      withTiming(0.96, { duration: 70 }),
      withSpring(1, { damping: 14 })
    );
    setTimeout(() => router.push("/(tabs)"), 100);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 16, paddingBottom: bottomPad + 40 },
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoRow}>
            <View style={[styles.logoIcon, { backgroundColor: colors.text }]}>
              <Feather name="lock" size={14} color={colors.background} />
            </View>
            <Text style={[styles.logoText, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
              lock in
            </Text>
          </View>
          <Pressable
            onPress={toggleTheme}
            style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, heroStyle]}>
          <Animated.View
            style={[
              styles.glowBehind,
              glowStyle,
              { backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
            ]}
          />

          <View style={[styles.heroBadge, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <View style={[styles.heroBadgeDot, { backgroundColor: isDark ? "#FFFFFF" : "#111111" }]} />
            <Text style={[styles.heroBadgeText, { color: colors.textSecondary, fontFamily: "Satoshi-Medium" }]}>
              AI-Powered Study Planner
            </Text>
          </View>

          <Text style={[styles.heroTitle, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
            {"Study Smarter,\nNot Harder"}
          </Text>

          <Text style={[styles.heroSubtitle, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
            Lock In creates personalized AI study plans tailored to your goals, schedule, and learning style.
          </Text>

          <Animated.View style={btnStyle}>
            <Pressable
              onPress={handleGetStarted}
              style={[
                styles.ctaButton,
                { backgroundColor: colors.text },
              ]}
            >
              <Text style={[styles.ctaText, { color: colors.background, fontFamily: "Satoshi-Bold" }]}>
                Get Started
              </Text>
              <Feather name="arrow-right" size={18} color={colors.background} />
            </Pressable>
          </Animated.View>

          <View style={styles.statsRow}>
            <StatBadge value="10K+" label="Students" delay={400} />
            <StatBadge value="95%" label="Success Rate" delay={550} />
            <StatBadge value="AI" label="Personalized" delay={700} />
          </View>
        </Animated.View>

        {/* Preview Card */}
        <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.previewHeader}>
            <Text style={[styles.previewDay, { color: colors.text, fontFamily: "Satoshi-Bold" }]}>
              Today's Plan
            </Text>
            <View style={[styles.previewBadge, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <View style={[styles.activeDot, { backgroundColor: isDark ? "#FFFFFF" : "#111111" }]} />
              <Text style={[styles.previewBadgeText, { color: colors.textSecondary, fontFamily: "Satoshi-Medium" }]}>
                3 sessions
              </Text>
            </View>
          </View>

          {[
            { subject: "Mathematics", time: "09:00 AM", duration: "1h 30m", done: true },
            { subject: "Physics", time: "11:00 AM", duration: "1h 00m", done: false },
            { subject: "Literature", time: "02:00 PM", duration: "45m", done: false },
          ].map((item, idx) => (
            <View
              key={idx}
              style={[styles.previewItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            >
              <View style={[
                styles.previewCheck,
                {
                  backgroundColor: item.done ? colors.text : "transparent",
                  borderColor: item.done ? colors.text : colors.cardBorder,
                }
              ]}>
                {item.done && <Feather name="check" size={10} color={colors.background} />}
              </View>
              <View style={styles.previewItemContent}>
                <Text style={[
                  styles.previewSubject,
                  {
                    color: item.done ? colors.textTertiary : colors.text,
                    fontFamily: "Satoshi-Medium",
                    textDecorationLine: item.done ? "line-through" : "none",
                  }
                ]}>
                  {item.subject}
                </Text>
                <Text style={[styles.previewTime, { color: colors.textTertiary, fontFamily: "Satoshi-Regular" }]}>
                  {item.time} · {item.duration}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Features */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
          Everything you need to excel
        </Text>

        <FeatureCard
          icon={<Feather name="cpu" size={18} color={colors.text} />}
          title="AI Study Plans"
          description="Fully personalized study schedules generated by AI based on your goals and deadlines."
          delay={100}
        />
        <FeatureCard
          icon={<Feather name="calendar" size={18} color={colors.text} />}
          title="Smart Scheduling"
          description="Balanced sessions with optimized breaks and spaced repetition for maximum retention."
          delay={200}
        />
        <FeatureCard
          icon={<Feather name="bar-chart-2" size={18} color={colors.text} />}
          title="Progress Tracking"
          description="Visual analytics to track your progress and keep you motivated across subjects."
          delay={300}
        />
        <FeatureCard
          icon={<Feather name="zap" size={18} color={colors.text} />}
          title="Focus Mode"
          description="Distraction-free study sessions with Pomodoro timers and streak tracking."
          delay={400}
        />

        {/* Bottom CTA */}
        <View style={[
          styles.bottomCta,
          { backgroundColor: colors.card, borderColor: colors.cardBorder },
        ]}>
          <Text style={[styles.bottomCtaTitle, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
            Ready to lock in?
          </Text>
          <Text style={[styles.bottomCtaSubtitle, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
            Start your AI-powered study journey today.
          </Text>
          <Pressable
            onPress={handleGetStarted}
            style={[styles.bottomCtaBtn, { backgroundColor: colors.text }]}
          >
            <Text style={[styles.bottomCtaBtnText, { color: colors.background, fontFamily: "Satoshi-Bold" }]}>
              Go to Dashboard
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 22 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 20, letterSpacing: -0.5 },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  heroSection: { alignItems: "center", marginBottom: 36, position: "relative" },
  glowBehind: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -40,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 22,
    borderWidth: 1,
  },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3 },
  heroBadgeText: { fontSize: 12, letterSpacing: 0.1 },
  heroTitle: {
    fontSize: 42,
    lineHeight: 50,
    textAlign: "center",
    letterSpacing: -1.5,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 6,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 30,
  },
  ctaText: { fontSize: 16 },
  statsRow: { flexDirection: "row", gap: 10 },
  statBadge: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
  },
  statValue: { fontSize: 22, marginBottom: 2 },
  statLabel: { fontSize: 11 },
  previewCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 36,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  previewDay: { fontSize: 15 },
  previewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  previewBadgeText: { fontSize: 12 },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 11,
    marginBottom: 8,
    borderWidth: 1,
    gap: 12,
  },
  previewCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  previewItemContent: { flex: 1 },
  previewSubject: { fontSize: 14, marginBottom: 2 },
  previewTime: { fontSize: 12 },
  sectionTitle: { fontSize: 26, letterSpacing: -0.8, marginBottom: 16 },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 14,
  },
  featureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  featureTextWrap: { flex: 1 },
  featureTitle: { fontSize: 14, marginBottom: 3 },
  featureDesc: { fontSize: 13, lineHeight: 19 },
  bottomCta: {
    marginTop: 20,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    gap: 8,
  },
  bottomCtaTitle: { fontSize: 24, letterSpacing: -0.8 },
  bottomCtaSubtitle: { fontSize: 14, textAlign: "center", marginBottom: 10 },
  bottomCtaBtn: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  bottomCtaBtnText: { fontSize: 15 },
});
