import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useStudy } from "@/contexts/StudyContext";
import Colors from "@/constants/colors";

function SettingRow({
  icon,
  iconBg,
  label,
  description,
  right,
  onPress,
  destructive,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  description?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingLabel,
            {
              color: destructive ? colors.destructive : colors.text,
              fontFamily: "Inter_600SemiBold",
            },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.settingDesc,
              { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      {right ||
        (onPress && (
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        ))}
    </Pressable>
  );
}

function ThemeOption({
  label,
  icon,
  mode,
  current,
  onPress,
}: {
  label: string;
  icon: string;
  mode: "light" | "dark" | "system";
  current: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const selected = mode === current;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.themeOption,
        {
          backgroundColor: selected ? `${Colors.primary}15` : colors.surface,
          borderColor: selected ? Colors.primary : colors.cardBorder,
        },
      ]}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={selected ? Colors.primary : colors.textSecondary}
      />
      <Text
        style={[
          styles.themeOptionText,
          {
            color: selected ? Colors.primary : colors.textSecondary,
            fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
          },
        ]}
      >
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark" size={14} color={Colors.primary} />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const { clearAll, sessions, activePlan, streakDays, subjectProgress } = useStudy();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const totalHours = (
    sessions.filter((s) => s.completed).reduce((a, s) => a + s.duration, 0) / 60
  ).toFixed(1);

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your study sessions and plans. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            clearAll();
          },
        },
      ]
    );
  };

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
        <Text
          style={[
            styles.pageTitle,
            { color: colors.text, fontFamily: "Inter_700Bold" },
          ]}
        >
          Settings
        </Text>

        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <View
            style={[
              styles.profileAvatar,
              { backgroundColor: `${Colors.primary}20` },
            ]}
          >
            <Ionicons name="lock-closed" size={28} color={Colors.primary} />
          </View>
          <View>
            <Text
              style={[
                styles.profileName,
                { color: colors.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              Lock In
            </Text>
            <Text
              style={[
                styles.profileSub,
                { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              AI Study Planner
            </Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          {[
            {
              value: `${streakDays}`,
              label: "Streak",
              icon: "flame",
              color: "#F59E0B",
            },
            {
              value: `${totalHours}h`,
              label: "Studied",
              icon: "time-outline",
              color: Colors.primary,
            },
            {
              value: `${subjectProgress.length}`,
              label: "Subjects",
              icon: "book-outline",
              color: "#8B5CF6",
            },
          ].map((stat, i) => (
            <View
              key={i}
              style={[
                styles.statCard,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <Ionicons name={stat.icon as any} size={18} color={stat.color} />
              <Text
                style={[
                  styles.statValue,
                  { color: colors.text, fontFamily: "Inter_700Bold" },
                ]}
              >
                {stat.value}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Appearance */}
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textSecondary, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          APPEARANCE
        </Text>
        <View
          style={[
            styles.themeCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <View style={styles.themeOptions}>
            <ThemeOption
              label="Light"
              icon="sunny-outline"
              mode="light"
              current={themeMode}
              onPress={() => {
                Haptics.selectionAsync();
                setThemeMode("light");
              }}
            />
            <ThemeOption
              label="Dark"
              icon="moon-outline"
              mode="dark"
              current={themeMode}
              onPress={() => {
                Haptics.selectionAsync();
                setThemeMode("dark");
              }}
            />
            <ThemeOption
              label="System"
              icon="phone-portrait-outline"
              mode="system"
              current={themeMode}
              onPress={() => {
                Haptics.selectionAsync();
                setThemeMode("system");
              }}
            />
          </View>
        </View>

        {/* App */}
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textSecondary, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          APP
        </Text>

        <SettingRow
          icon={<Ionicons name="home-outline" size={18} color="#FFFFFF" />}
          iconBg="#14B8A6"
          label="Go to Home"
          description="View the app landing page"
          onPress={() => {
            Haptics.selectionAsync();
            router.push("/");
          }}
        />

        <SettingRow
          icon={<Ionicons name="information-circle-outline" size={18} color="#FFFFFF" />}
          iconBg="#3B82F6"
          label="About Lock In"
          description="Version 1.0.0"
        />

        {/* Data */}
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textSecondary, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          DATA
        </Text>

        <SettingRow
          icon={<Ionicons name="trash-outline" size={18} color="#FFFFFF" />}
          iconBg="#EF4444"
          label="Clear All Data"
          description="Delete all sessions and plans"
          onPress={handleClearData}
          destructive
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 28, letterSpacing: -0.8, marginBottom: 20 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: { fontSize: 20, marginBottom: 2 },
  profileSub: { fontSize: 13 },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  statValue: { fontSize: 18 },
  statLabel: { fontSize: 11 },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  themeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 24,
  },
  themeOptions: { flexDirection: "row", gap: 8 },
  themeOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  themeOptionText: { fontSize: 12 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 15, marginBottom: 1 },
  settingDesc: { fontSize: 12 },
});
