import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { Training } from "@/types/Training";
import getPerformance from "@/utils/getPerformance";

const HISTORY_STORAGE_KEY = "training-tracker-history";

const useHistory = () => {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [history, setHistory] = useState<Training[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Always-current history, so writes derive from the latest value (not the
  // render-time `history`) and persist synchronously — callers rely on the
  // localStorage write having happened when addTraining returns
  const historyRef = useRef(history);

  // Redirect if no user
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const persistHistory = (newHistory: Training[]) => {
    historyRef.current = newHistory;
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const addTraining = (training: Training) => {
    const performance = getPerformance(training);

    const newTraining = { ...training, performance };

    persistHistory([...historyRef.current, newTraining]);
  };

  const deleteTraining = (training: Training) => {
    persistHistory(
      historyRef.current.filter((t) => t.startTime !== training.startTime),
    );
  };

  const clearHistory = () => {
    historyRef.current = [];
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  return {
    history,
    isLoading: isUserLoading,

    addTraining,
    deleteTraining,
    clearHistory,
  };
};

export default useHistory;
