import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StudySession {
  id: string;
  subject: string;
  duration: number;
  startTime: string;
  completed: boolean;
  date: string;
}

export interface StudyPlan {
  id: string;
  createdAt: string;
  goal: string;
  subjects: string[];
  sessions: StudySession[];
}

export interface SubjectProgress {
  subject: string;
  totalMinutes: number;
  color: string;
  completedSessions: number;
  totalSessions: number;
}

interface StudyContextValue {
  sessions: StudySession[];
  activePlan: StudyPlan | null;
  todaySessions: StudySession[];
  weeklyMinutes: number[];
  subjectProgress: SubjectProgress[];
  streakDays: number;
  totalMinutesToday: number;
  addSession: (session: StudySession) => void;
  toggleSessionComplete: (id: string) => void;
  setActivePlan: (plan: StudyPlan) => void;
  clearAll: () => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

const STORAGE_KEYS = {
  sessions: "@lockin_sessions",
  activePlan: "@lockin_active_plan",
};

const SUBJECT_COLORS = [
  "#14B8A6",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#10B981",
  "#EC4899",
  "#6366F1",
];

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

export function StudyProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activePlan, setActivePlanState] = useState<StudyPlan | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsRaw, planRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.sessions),
        AsyncStorage.getItem(STORAGE_KEYS.activePlan),
      ]);
      if (sessionsRaw) setSessions(JSON.parse(sessionsRaw));
      if (planRaw) setActivePlanState(JSON.parse(planRaw));
    } catch {}
  };

  const saveSessions = async (data: StudySession[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(data));
  };

  const addSession = (session: StudySession) => {
    setSessions((prev) => {
      const updated = [...prev, session];
      saveSessions(updated);
      return updated;
    });
  };

  const toggleSessionComplete = (id: string) => {
    setSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      );
      saveSessions(updated);
      return updated;
    });
    if (activePlan) {
      const updatedPlan = {
        ...activePlan,
        sessions: activePlan.sessions.map((s) =>
          s.id === id ? { ...s, completed: !s.completed } : s
        ),
      };
      setActivePlanState(updatedPlan);
      AsyncStorage.setItem(
        STORAGE_KEYS.activePlan,
        JSON.stringify(updatedPlan)
      );
    }
  };

  const setActivePlan = async (plan: StudyPlan) => {
    setActivePlanState(plan);
    await AsyncStorage.setItem(STORAGE_KEYS.activePlan, JSON.stringify(plan));
    const allSessions = [
      ...sessions.filter((s) => s.date !== getTodayDateString()),
      ...plan.sessions,
    ];
    setSessions(allSessions);
    await saveSessions(allSessions);
  };

  const clearAll = async () => {
    setSessions([]);
    setActivePlanState(null);
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  };

  const todaySessions = useMemo(() => {
    const today = getTodayDateString();
    if (activePlan) {
      return activePlan.sessions.filter((s) => s.date === today);
    }
    return sessions.filter((s) => s.date === today);
  }, [sessions, activePlan]);

  const weeklyMinutes = useMemo(() => {
    const days: number[] = Array(7).fill(0);
    const now = new Date();
    sessions.forEach((s) => {
      if (!s.completed) return;
      const sessionDate = new Date(s.date);
      const diffDays = Math.floor(
        (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays >= 0 && diffDays < 7) {
        days[6 - diffDays] += s.duration;
      }
    });
    return days;
  }, [sessions]);

  const subjectProgress = useMemo(() => {
    const map: Record<
      string,
      { total: number; completed: number; total2: number }
    > = {};
    const allSessions = activePlan ? activePlan.sessions : sessions;
    allSessions.forEach((s) => {
      if (!map[s.subject]) map[s.subject] = { total: 0, completed: 0, total2: 0 };
      map[s.subject].total2++;
      if (s.completed) {
        map[s.subject].total += s.duration;
        map[s.subject].completed++;
      }
    });
    return Object.entries(map).map(([subject, data], idx) => ({
      subject,
      totalMinutes: data.total,
      color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length],
      completedSessions: data.completed,
      totalSessions: data.total2,
    }));
  }, [sessions, activePlan]);

  const totalMinutesToday = useMemo(
    () =>
      todaySessions.filter((s) => s.completed).reduce((a, s) => a + s.duration, 0),
    [todaySessions]
  );

  const streakDays = useMemo(() => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const hadSession = sessions.some((s) => s.date === dateStr && s.completed);
      if (hadSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [sessions]);

  const value = useMemo(
    () => ({
      sessions,
      activePlan,
      todaySessions,
      weeklyMinutes,
      subjectProgress,
      streakDays,
      totalMinutesToday,
      addSession,
      toggleSessionComplete,
      setActivePlan,
      clearAll,
    }),
    [sessions, activePlan, todaySessions, weeklyMinutes, subjectProgress, streakDays, totalMinutesToday]
  );

  return (
    <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error("useStudy must be used within StudyProvider");
  return context;
}
