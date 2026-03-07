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
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useStudy } from "@/contexts/StudyContext";

function SettingRow({
  icon,
  label,
  description,
  right,
  onPress,
  destructive,
}: {
  icon: React.ReactNode;
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
        { backgroundColor: colors.card, borderColor: colors.cardBorder, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingLabel,
          { color: destructive ? colors.destructive : colors.text, fontFamily: "Satoshi-Medium" },
        ]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.settingDesc, { color: colors.textTertiary, fontFamily: "Satoshi-Regular" }]}>
            {description}
          </Text>
        )}
      </View>
      {right || (onPress && <Feather name="chevron-right" size={15} color={colors.textTertiary} />)}
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
          backgroundColor: selected ? colors.text : colors.surface,
          borderColor: selected ? colors.text : colors.cardBorder,
        },
      ]}
    >
      <Ionicons
        name={icon as any}
        size={18}
        color={selected ? colors.background : colors.textSecondary}
      />
      <Text style={[
        styles.themeOptionText,
        {
          color: selected ? colors.background : colors.textSecondary,
          fontFamily: selected ? "Satoshi-Bold" : "Satoshi-Regular",
        },
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { clearAll, sessions, subjectProgress, streakDays } = useStudy();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const totalHours = (
    sessions.filter((s) => s.completed).reduce((a, s) => a + s.duration, 0) / 60
  ).toFixed(1);

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your sessions and plans. This cannot be undone.",
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
        <Text style={[styles.pageTitle, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
          Settings
        </Text>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={[styles.profileAvatar, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Feather name="lock" size={24} color={colors.text} />
          </View>
          <View>
            <Text style={[styles.profileName, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
              Lock In
            </Text>
            <Text style={[styles.profileSub, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
              AI Study Planner
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { value: `${streakDays}`, label: "Streak", icon: "flame-outline" as const },
            { value: `${totalHours}h`, label: "Studied", icon: "time-outline" as const },
            { value: `${subjectProgress.length}`, label: "Subjects", icon: "book-outline" as const },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Ionicons name={stat.icon} size={16} color={colors.textSecondary} />
              <Text style={[styles.statValue, { color: colors.text, fontFamily: "Satoshi-Black" }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: "Satoshi-Regular" }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Appearance */}
        <Text style={[styles.sectionLabel, { color: colors.textTertiary, fontFamily: "Satoshi-Bold" }]}>
          APPEARANCE
        </Text>
        <View style={[styles.themeCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.themeOptions}>
            <ThemeOption label="Light" icon="sunny-outline" mode="light" current={themeMode}
              onPress={() => { Haptics.selectionAsync(); setThemeMode("light"); }} />
            <ThemeOption label="Dark" icon="moon-outline" mode="dark" current={themeMode}
              onPress={() => { Haptics.selectionAsync(); setThemeMode("dark"); }} />
            <ThemeOption label="System" icon="phone-portrait-outline" mode="system" current={themeMode}
              onPress={() => { Haptics.selectionAsync(); setThemeMode("system"); }} />
          </View>
        </View>

        {/* App */}
        <Text style={[styles.sectionLabel, { color: colors.textTertiary, fontFamily: "Satoshi-Bold" }]}>
          APP
        </Text>

        <SettingRow
          icon={<Feather name="home" size={16} color={colors.textSecondary} />}
          label="Home Page"
          description="View the app landing page"
          onPress={() => { Haptics.selectionAsync(); router.push("/"); }}
        />
        <SettingRow
          icon={<Feather name="info" size={16} color={colors.textSecondary} />}
          label="About"
          description="Lock In · Version 1.0.0"
        />

        {/* Data */}
        <Text style={[styles.sectionLabel, { color: colors.textTertiary, fontFamily: "Satoshi-Bold" }]}>
          DATA
        </Text>

        <SettingRow
          icon={<Feather name="trash-2" size={16} color={colors.destructive} />}
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
  scrollContent: { paddingHorizontal: 22 },
  pageTitle: { fontSize: 28, letterSpacing: -0.8, marginBottom: 22 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  profileName: { fontSize: 20, marginBottom: 2 },
  profileSub: { fontSize: 13 },
  statsGrid: { flexDirection: "row", gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 13,
    borderWidth: 1,
    gap: 4,
  },
  statValue: { fontSize: 18 },
  statLabel: { fontSize: 11 },
  sectionLabel: { fontSize: 11, letterSpacing: 0.8, marginBottom: 8, marginLeft: 2 },
  themeCard: { borderRadius: 14, borderWidth: 1, padding: 10, marginBottom: 24 },
  themeOptions: { flexDirection: "row", gap: 8 },
  themeOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 5,
  },
  themeOptionText: { fontSize: 12 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 13,
    marginBottom: 9,
    borderWidth: 1,
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 14, marginBottom: 1 },
  settingDesc: { fontSize: 12 },
});
