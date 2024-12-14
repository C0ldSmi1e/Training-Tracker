import { useState, useEffect } from "react";
import useSWR from "swr";
import { CodeforcesProblem, ProblemTag } from "@/types/Codeforces";
import getAllProblems from "@/utils/codeforces/getAllProblems";
import getSolvedProblems from "@/utils/codeforces/getSolvedProblems";
import { User } from "@/types/User";

const PROBLEMS_CACHE_KEY = "codeforces-all-problems";
const SOLVED_PROBLEMS_CACHE_KEY = (handle: string) =>
  `codeforces-solved-${handle}`;

const useProblems = (user: User | null | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [problemPools, setProblemPools] = useState<{
    rating: number,
    solved: CodeforcesProblem[],
    unsolved: CodeforcesProblem[]
  }[]>([]);

  // Fetch all problems
  const { data: allProblems, isLoading: isLoadingAll } = useSWR<CodeforcesProblem[]>(
    PROBLEMS_CACHE_KEY,
    async () => {
      const res = await getAllProblems();
      if (!res.success) {
        throw new Error("Failed to fetch problems");
      }
      return res.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3600000,
    }
  );

  // Fetch solved problems only if we have a user
  const {
    data: solvedProblems,
    isLoading: isLoadingSolved,
    mutate: mutateSolved
  } = useSWR<CodeforcesProblem[]>(
    user ? SOLVED_PROBLEMS_CACHE_KEY(user.codeforcesHandle) : null,
    async () => {
      if (!user) {
        throw new Error("No user");
      }
      const res = await getSolvedProblems(user);
      if (!res.success) {
        throw new Error("Failed to fetch solved problems");
      }
      return res.data;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  // Update problem pools when problems data changes
  useEffect(() => {
    if (!user || isLoadingAll) {
      return;
    }
  
    const ratings = [
      parseInt(user.level.P1),
      parseInt(user.level.P2),
      parseInt(user.level.P3),
      parseInt(user.level.P4),
    ];
  
    const solvedProblemIds = new Set(
      solvedProblems?.map((p) => `${p.contestId}_${p.index}`) ?? []
    );

  
    const unsolvedProblems = allProblems?.filter(
      (problem) => !solvedProblemIds.has(`${problem.contestId}_${problem.index}`)
    );
  
    const newProblemPools = ratings.map((rating) => ({
      rating,
      solved: solvedProblems?.filter((problem) => problem.rating === rating) ?? [],
      unsolved: unsolvedProblems?.filter((problem) => problem.rating === rating) ?? [],
    }));

    console.log(newProblemPools);

    setProblemPools(newProblemPools);
  }, [user, allProblems, solvedProblems, isLoadingAll]);

  const refreshSolvedProblems = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);

    try {
      // Await the mutation and capture the updated data
      const updatedData = await mutateSolved(async () => {
        const res = await getSolvedProblems(user);
        if (!res.success) {
          throw new Error("Failed to fetch solved problems");
        }
        return res.data;
      }, { revalidate: true });

      setIsLoading(false);
      // Return the updated data so caller can use it immediately
      return updatedData;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const getRandomProblems = (tags: ProblemTag[]) => {
    if (!user || problemPools.length === 0) {
      return;
    }

    console.log(tags);

    setIsLoading(true);

    const newProblems = problemPools.map((pool) => {
      let problem = null;

      let newPool = pool;
      if (tags.length > 0) {
        newPool = {
          ...pool,
          solved: pool.solved.filter(
            (problem) => tags.some((tag: ProblemTag) => problem.tags.includes(tag.value))
          ),
          unsolved: pool.unsolved.filter(
            (problem) => tags.some((tag: ProblemTag) => problem.tags.includes(tag.value))
          ),
        };
      }

      if (newPool.unsolved.length > 0) {
        problem = newPool.unsolved[Math.floor(Math.random() * Math.min(20, newPool.unsolved.length))];
      } else {
        problem = newPool.solved[Math.floor(Math.random() * Math.min(20, newPool.solved.length))];
      }
      return {
        ...problem,
        url: `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`,
        solvedTime: null,
      };
    });

    setIsLoading(false);
    return newProblems;
  };


  return {
    allProblems: allProblems ?? [],
    solvedProblems: solvedProblems ?? [],
    isLoading: isLoading || isLoadingAll || isLoadingSolved,

    refreshSolvedProblems,
    getRandomProblems,
  };
};

export default useProblems;
