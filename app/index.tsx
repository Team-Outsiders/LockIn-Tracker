import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

function FeatureCard({
  icon,
  title,
  description,
  delay,
  iconBg,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  iconBg: string;
}) {
  const { colors, isDark } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 20, stiffness: 90 })
    );
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
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View style={[styles.featureIconWrap, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.featureTextWrap}>
        <Text
          style={[
            styles.featureTitle,
            { color: colors.text, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.featureDesc,
            { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
          ]}
        >
          {description}
        </Text>
      </View>
    </Animated.View>
  );
}

function StatBadge({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        styles.statBadge,
        { backgroundColor: colors.surface, borderColor: colors.cardBorder },
      ]}
    >
      <Text
        style={[
          styles.statValue,
          { color: Colors.primary, fontFamily: "Inter_700Bold" },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.statLabel,
          { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
        ]}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(40);
  const buttonScale = useSharedValue(1);
  const glowPulse = useSharedValue(0.6);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 800 });
    heroTranslateY.value = withSpring(0, { damping: 20, stiffness: 80 });
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value,
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleGetStarted = () => {
    buttonScale.value = withSequence(
      withTiming(0.96, { duration: 80 }),
      withSpring(1, { damping: 15 })
    );
    setTimeout(() => router.push("/(tabs)"), 120);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPad + 16, paddingBottom: bottomPad + 40 },
        ]}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
            </View>
            <Text
              style={[
                styles.logoText,
                { color: colors.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              Lock In
            </Text>
          </View>
          <Pressable
            onPress={toggleTheme}
            style={[
              styles.themeToggle,
              {
                backgroundColor: colors.surface,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={18}
              color={isDark ? "#F59E0B" : "#6366F1"}
            />
          </Pressable>
        </View>

        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, heroStyle]}>
          {/* Glow effect */}
          <Animated.View style={[styles.glowBehind, glowStyle]} />

          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={12} color={Colors.accent} />
            <Text
              style={[
                styles.heroBadgeText,
                { color: Colors.accent, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              AI-Powered Study Planner
            </Text>
          </View>

          <Text
            style={[
              styles.heroTitle,
              { color: colors.text, fontFamily: "Inter_700Bold" },
            ]}
          >
            {"Study Smarter,\nNot Harder"}
          </Text>

          <Text
            style={[
              styles.heroSubtitle,
              { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
          >
            Lock In creates personalized AI study plans tailored to your goals,
            schedule, and learning style.
          </Text>

          {/* CTA Button */}
          <Animated.View style={btnStyle}>
            <Pressable onPress={handleGetStarted}>
              <LinearGradient
                colors={["#14B8A6", "#0D9488"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaButton}
              >
                <Text
                  style={[
                    styles.ctaText,
                    { fontFamily: "Inter_700Bold" },
                  ]}
                >
                  Get Started
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatBadge value="10K+" label="Students" delay={400} />
            <StatBadge value="95%" label="Success Rate" delay={550} />
            <StatBadge value="AI" label="Personalized" delay={700} />
          </View>
        </Animated.View>

        {/* Feature Preview Card */}
        <View
          style={[
            styles.previewCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <LinearGradient
            colors={
              isDark
                ? ["rgba(20,184,166,0.15)", "rgba(20,184,166,0)"]
                : ["rgba(20,184,166,0.08)", "rgba(20,184,166,0)"]
            }
            style={styles.previewGradient}
          >
            <View style={styles.previewHeader}>
              <Text
                style={[
                  styles.previewDay,
                  {
                    color: Colors.primary,
                    fontFamily: "Inter_600SemiBold",
                  },
                ]}
              >
                Today's Plan
              </Text>
              <View style={styles.previewBadge}>
                <View style={styles.activeDot} />
                <Text
                  style={[
                    styles.previewBadgeText,
                    {
                      color: Colors.primary,
                      fontFamily: "Inter_500Medium",
                    },
                  ]}
                >
                  3 sessions
                </Text>
              </View>
            </View>

            {[
              { subject: "Mathematics", time: "09:00 AM", duration: "1h 30m", progress: 0.7 },
              { subject: "Physics", time: "11:00 AM", duration: "1h 00m", progress: 0.3 },
              { subject: "Literature", time: "02:00 PM", duration: "45m", progress: 0 },
            ].map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.previewItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.previewDot,
                    {
                      backgroundColor:
                        item.progress > 0 ? Colors.primary : colors.cardBorder,
                    },
                  ]}
                />
                <View style={styles.previewItemContent}>
                  <Text
                    style={[
                      styles.previewSubject,
                      { color: colors.text, fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {item.subject}
                  </Text>
                  <Text
                    style={[
                      styles.previewTime,
                      {
                        color: colors.textSecondary,
                        fontFamily: "Inter_400Regular",
                      },
                    ]}
                  >
                    {item.time} · {item.duration}
                  </Text>
                </View>
                {item.progress > 0 && (
                  <View
                    style={[
                      styles.progressPill,
                      { backgroundColor: `rgba(20,184,166,0.15)` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.progressPillText,
                        {
                          color: Colors.primary,
                          fontFamily: "Inter_600SemiBold",
                        },
                      ]}
                    >
                      {Math.round(item.progress * 100)}%
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* Features Section */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, fontFamily: "Inter_700Bold" },
          ]}
        >
          Everything you need to excel
        </Text>

        <FeatureCard
          icon={
            <MaterialCommunityIcons name="brain" size={22} color="#FFFFFF" />
          }
          iconBg="#8B5CF6"
          title="AI Study Plans"
          description="Get a fully personalized study schedule generated by AI based on your goals and deadline."
          delay={100}
        />
        <FeatureCard
          icon={<Ionicons name="calendar-outline" size={22} color="#FFFFFF" />}
          iconBg="#14B8A6"
          title="Smart Scheduling"
          description="Automatically balance study sessions with breaks and review cycles for maximum retention."
          delay={200}
        />
        <FeatureCard
          icon={
            <Ionicons name="bar-chart-outline" size={22} color="#FFFFFF" />
          }
          iconBg="#F59E0B"
          title="Progress Tracking"
          description="Visual analytics to track your progress across subjects and keep you motivated."
          delay={300}
        />
        <FeatureCard
          icon={<Ionicons name="flash-outline" size={22} color="#FFFFFF" />}
          iconBg="#EF4444"
          title="Focus Mode"
          description="Distraction-free study sessions with Pomodoro timers and streak tracking."
          delay={400}
        />

        {/* Bottom CTA */}
        <View
          style={[
            styles.bottomCta,
            {
              backgroundColor: isDark
                ? "rgba(20,184,166,0.1)"
                : "rgba(20,184,166,0.06)",
              borderColor: isDark
                ? "rgba(20,184,166,0.25)"
                : "rgba(20,184,166,0.18)",
            },
          ]}
        >
          <Text
            style={[
              styles.bottomCtaTitle,
              { color: colors.text, fontFamily: "Inter_700Bold" },
            ]}
          >
            Ready to lock in?
          </Text>
          <Text
            style={[
              styles.bottomCtaSubtitle,
              {
                color: colors.textSecondary,
                fontFamily: "Inter_400Regular",
              },
            ]}
          >
            Start your AI-powered study journey today.
          </Text>
          <Pressable onPress={handleGetStarted}>
            <LinearGradient
              colors={["#14B8A6", "#0D9488"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bottomCtaBtn}
            >
              <Text
                style={[
                  styles.bottomCtaBtnText,
                  { fontFamily: "Inter_700Bold" },
                ]}
              >
                Go to Dashboard
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#14B8A6",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 20,
    letterSpacing: -0.5,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
  },
  glowBehind: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(20,184,166,0.15)",
    top: -30,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(20,184,166,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(20,184,166,0.25)",
  },
  heroBadgeText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  heroTitle: {
    fontSize: 40,
    lineHeight: 48,
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 28,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 17,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBadge: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
  },
  previewCard: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 36,
    overflow: "hidden",
  },
  previewGradient: {
    padding: 20,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  previewDay: {
    fontSize: 16,
  },
  previewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(20,184,166,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#14B8A6",
  },
  previewBadgeText: {
    fontSize: 12,
  },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    gap: 12,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewItemContent: {
    flex: 1,
  },
  previewSubject: {
    fontSize: 14,
    marginBottom: 2,
  },
  previewTime: {
    fontSize: 12,
  },
  progressPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  progressPillText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 24,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 14,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  bottomCta: {
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    gap: 8,
  },
  bottomCtaTitle: {
    fontSize: 22,
    letterSpacing: -0.5,
  },
  bottomCtaSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  bottomCtaBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bottomCtaBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
