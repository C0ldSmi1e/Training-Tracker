import { useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { TrainingProblem } from "@/types/TrainingProblem";
import { SuccessResponse, ErrorResponse } from "@/types/Response";
import useUser from "@/hooks/useUser";
import useProblems from "@/hooks/useProblems";
import { getProblemId } from "@/utils/codeforces/getSolvedProblems";

const UPSOLVED_PROBLEMS_CACHE_KEY = "training-tracker-upsolved-problems";

const getStoredUpsolvedProblems = () => {
  try {
    const stored = localStorage.getItem(UPSOLVED_PROBLEMS_CACHE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const useUpsolvedProblems = () => {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const {
    isLoading: isProblemsLoading,
    refreshSolvedProblems,
    solvedProblems,
    solvedAtByProblemId,
  } = useProblems(user);
  const { data, isLoading, error, mutate } = useSWR<TrainingProblem[]>(
    UPSOLVED_PROBLEMS_CACHE_KEY,
    getStoredUpsolvedProblems,
  );

  // Redirect if no user
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  // make sure the data is an array
  const upsolvedProblems = useMemo(() => data ?? [], [data]);

  const refreshUpsolvedProblems = useCallback(async () => {
    if (upsolvedProblems?.length === 0) {
      return;
    }
    const newUpsolvedProblems = upsolvedProblems.map((problem) => {
      const solvedAt = solvedAtByProblemId.get(getProblemId(problem));
      if (solvedAt !== undefined && !problem.solvedTime) {
        return {
          ...problem,
          solvedTime: solvedAt,
        };
      }
      return problem;
    });

    if (
      JSON.stringify(newUpsolvedProblems) !== JSON.stringify(upsolvedProblems)
    ) {
      await mutate(newUpsolvedProblems, { revalidate: false });
    }
  }, [upsolvedProblems, solvedAtByProblemId, mutate]);

  useEffect(() => {
    if (solvedProblems?.length > 0) {
      refreshUpsolvedProblems();
    }
  }, [solvedProblems, refreshUpsolvedProblems]);

  useEffect(() => {
    if (upsolvedProblems) {
      localStorage.setItem(
        UPSOLVED_PROBLEMS_CACHE_KEY,
        JSON.stringify(upsolvedProblems),
      );
    }
  }, [upsolvedProblems]);

  const addUpsolvedProblems = async (problems: TrainingProblem[]) => {
    try {
      // Filter out problems that are already in the list
      const newProblems = problems.filter(
        (problem) =>
          !upsolvedProblems?.some(
            (p) =>
              p.contestId === problem.contestId && p.index === problem.index,
          ),
      );

      if (newProblems.length === 0) {
        return SuccessResponse(upsolvedProblems);
      }

      const newUpsolvedProblems = [...(upsolvedProblems ?? []), ...newProblems];
      await mutate(newUpsolvedProblems, { revalidate: false });
      return SuccessResponse(newUpsolvedProblems);
    } catch (error) {
      return ErrorResponse(error as string);
    }
  };

  const deleteUpsolvedProblem = async (problem: TrainingProblem) => {
    try {
      const newUpsolvedProblems = await mutate(
        (current) =>
          (current ?? []).filter(
            (p) =>
              p.contestId !== problem.contestId || p.index !== problem.index,
          ),
        { revalidate: false },
      );
      return SuccessResponse(newUpsolvedProblems);
    } catch (error) {
      return ErrorResponse(error as string);
    }
  };

  const onRefreshUpsolvedProblems = async () => {
    await refreshSolvedProblems();
    await refreshUpsolvedProblems();
  };

  return {
    upsolvedProblems,
    isLoading: isUserLoading || isProblemsLoading || isLoading,
    error,
    addUpsolvedProblems,
    deleteUpsolvedProblem,
    refreshUpsolvedProblems,
    onRefreshUpsolvedProblems,
  };
};

export default useUpsolvedProblems;
