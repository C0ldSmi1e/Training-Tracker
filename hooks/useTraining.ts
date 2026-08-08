import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import useProblems from "@/hooks/useProblems";
import { TrainingProblem } from "@/types/TrainingProblem";
import { Training } from "@/types/Training";
import { ProblemTag } from "@/types/Codeforces";
import useHistory from "@/hooks/useHistory";
import useUpsolvedProblems from "@/hooks/useUpsolvedProblems";
import {
  getProblemId,
  toSolvedAtMap,
  SolvedProblem,
} from "@/utils/codeforces/getSolvedProblems";

const TRAINING_STORAGE_KEY = "training-tracker-training";

const useTraining = () => {
  const router = useRouter();
  const { user, isLoading: isUserLoading, updateUserLevel } = useUser();
  const {
    solvedProblems,
    solvedAtByProblemId,
    isLoading: isProblemsLoading,
    refreshSolvedProblems,
    getRandomProblems,
  } = useProblems(user);
  const { addTraining } = useHistory();
  const { addUpsolvedProblems } = useUpsolvedProblems();

  const [problems, setProblems] = useState<TrainingProblem[]>([]);
  const [training, setTraining] = useState<Training | null>(() => {
    try {
      const stored = localStorage.getItem(TRAINING_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isTraining, setIsTraining] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>(undefined);
  // Guards finishTraining against reentrancy: the timer effect and the
  // all-solved effect can both call it in the same commit
  const isFinishingRef = useRef(false);

  // Stamp problems with the real solve time (earliest accepted submission).
  // A pre-training AC (stale solved cache, or a problem drawn from the
  // solved pool) is clamped to the training start so elapsed times and
  // performance never go negative.
  const applySolvedTimes = useCallback(
    (
      problems: TrainingProblem[],
      solvedAtMap: Map<string, number>,
      startTime: number,
    ) =>
      problems.map((problem) => {
        const solvedAt = solvedAtMap.get(getProblemId(problem));
        return {
          ...problem,
          solvedTime:
            solvedAt !== undefined
              ? (problem.solvedTime ?? Math.max(solvedAt, startTime))
              : problem.solvedTime,
        };
      }),
    [],
  );

  const updateProblemStatus = useCallback(
    (solvedAtMap: Map<string, number> = solvedAtByProblemId) => {
      setTraining((prev) => {
        if (!prev) {
          return null;
        }

        const updatedProblems = applySolvedTimes(
          prev.problems,
          solvedAtMap,
          prev.startTime,
        );

        // Only update if there are changes
        if (JSON.stringify(prev.problems) === JSON.stringify(updatedProblems)) {
          return prev;
        }

        const updatedTraining = {
          ...prev,
          problems: updatedProblems,
        };

        localStorage.setItem(
          TRAINING_STORAGE_KEY,
          JSON.stringify(updatedTraining),
        );
        return updatedTraining;
      });
    },
    [solvedAtByProblemId, applySolvedTimes],
  );

  const refreshProblemStatus = useCallback(async () => {
    // Pass the fresh solved data in explicitly — the updateProblemStatus
    // closure would otherwise still see the pre-refresh solved list
    let latestSolvedProblems: SolvedProblem[] | undefined;
    try {
      latestSolvedProblems = await refreshSolvedProblems();
    } catch (error) {
      // Fall back to the last known solved data
      console.error("Failed to refresh solved problems:", error);
    }
    updateProblemStatus(
      latestSolvedProblems ? toSolvedAtMap(latestSolvedProblems) : undefined,
    );
  }, [refreshSolvedProblems, updateProblemStatus]);

  const finishTraining = useCallback(async () => {
    // Only let one invocation proceed — checked and set synchronously so
    // two calls in the same commit can't both write history / update level
    if (isFinishingRef.current) {
      return;
    }
    isFinishingRef.current = true;

    // Immediately set training state to false to prevent any race conditions
    setIsTraining(false);

    // Clear any existing timer first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }

    // Capture current training value before clearing state
    const currentTraining = training;

    // Clear in-memory training state immediately, but keep the stored
    // training in localStorage until the history entry is written so a
    // failure here can't silently lose the training
    setProblems([]);
    setTraining(null);

    try {
      // Only proceed with history update if there was an active training
      if (!currentTraining) {
        localStorage.removeItem(TRAINING_STORAGE_KEY);
        return;
      }

      // Discard a corrupted zero-problem training: no history entry,
      // no level change
      if (currentTraining.problems.length === 0) {
        localStorage.removeItem(TRAINING_STORAGE_KEY);
        return;
      }

      let historyWritten = false;
      try {
        // Refresh the solved list to get the final statuses; on failure fall
        // back to the last known solved data instead of dropping the training
        let solvedAtMap = solvedAtByProblemId;
        try {
          const latestSolvedProblems = await refreshSolvedProblems();
          if (latestSolvedProblems) {
            solvedAtMap = toSolvedAtMap(latestSolvedProblems);
          }
        } catch {
          // Keep the last known solved data
        }

        const updatedProblems = applySolvedTimes(
          currentTraining.problems,
          solvedAtMap,
          currentTraining.startTime,
        );

        addTraining({ ...currentTraining, problems: updatedProblems });
        historyWritten = true;

        // The training is safely in history now — drop the stored training
        localStorage.removeItem(TRAINING_STORAGE_KEY);

        // if solved all problems, user level +1
        // otherwise, user level -1
        const delta =
          updatedProblems.length > 0 &&
          updatedProblems.every((p) => p.solvedTime)
            ? 1
            : -1;
        updateUserLevel({ delta });

        // Add unsolved problems to upsolved problems list
        const unsolvedProblems = updatedProblems.filter((p) => !p.solvedTime);
        addUpsolvedProblems(unsolvedProblems);

        router.push("/statistics");
      } catch (error) {
        // Re-persist the training so it isn't lost — but only if the
        // history entry was never written, otherwise the restored training
        // would finish again on the next mount and duplicate the entry
        if (!historyWritten) {
          localStorage.setItem(
            TRAINING_STORAGE_KEY,
            JSON.stringify(currentTraining),
          );
        }
        console.error("Failed to finish training:", error);
      }
    } finally {
      isFinishingRef.current = false;
    }
  }, [
    training,
    solvedAtByProblemId,
    applySolvedTimes,
    addTraining,
    router,
    refreshSolvedProblems,
    updateUserLevel,
    addUpsolvedProblems,
  ]);

  // Redirect if no user
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  // Manage training timer and localStorage sync
  useEffect(() => {
    if (!training) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      return;
    }

    localStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(training));
    const now = new Date().getTime();
    const timeLeft = training.endTime - now;

    if (timeLeft <= 0) {
      finishTraining();
      return;
    }

    setIsTraining(now <= training.endTime);

    timerRef.current = setTimeout(() => {
      finishTraining();
    }, timeLeft);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [training, finishTraining]);

  useEffect(() => {
    if (training && training.problems.every((p) => p.solvedTime)) {
      finishTraining();
    }
  }, [training, finishTraining]);

  useEffect(() => {
    if (!isTraining || !training || !solvedProblems) {
      return;
    }
    updateProblemStatus();
  }, [isTraining, training, solvedProblems, updateProblemStatus]);

  const startTraining = () => {
    if (!user) {
      router.push("/");
      return;
    }

    // Will start in 30 seconds
    const startTime = new Date().getTime() + 10000;

    const endTime = startTime + parseInt(user.level.time) * 60000;

    setTraining({
      startTime,
      endTime,
      level: user.level,
      problems,
      performance: 0,
    });
  };

  const stopTraining = () => {
    setIsTraining(false);
    setTraining(null);
    localStorage.removeItem(TRAINING_STORAGE_KEY);
  };

  const generateProblems = (tags: ProblemTag[], lb: number, ub: number) => {
    const newProblems = getRandomProblems(tags, lb, ub);
    if (newProblems) {
      setProblems(newProblems);
    }
  };

  return {
    problems,
    isLoading: isUserLoading || isProblemsLoading,

    training,
    isTraining,
    generateProblems,
    startTraining,
    stopTraining,
    refreshProblemStatus,
    finishTraining,
  };
};

export default useTraining;
