import { useEffect, useState } from "react";
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

  // Redirect if no user
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const addTraining = (training: Training) => {
    const performance = getPerformance(training);

    const newTraining = { ...training, performance };

    setHistory((prev) => [...prev, newTraining]);

    localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify([...history, newTraining]),
    );
  };

  const deleteTraining = (training: Training) => {
    setHistory((prev) =>
      prev.filter((t) => t.startTime !== training.startTime),
    );
    localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(history.filter((t) => t.startTime !== training.startTime)),
    );
  };

  const clearHistory = () => {
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
