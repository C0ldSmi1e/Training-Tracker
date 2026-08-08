import { User } from "@/types/User";
import { CodeforcesProblem } from "@/types/Codeforces";
import { SuccessResponse, ErrorResponse, Response } from "@/types/Response";
import getSubmissions from "@/utils/codeforces/getSubmissions";

type SolvedProblem = {
  problem: CodeforcesProblem;
  // Milliseconds timestamp of the earliest accepted submission
  solvedAt: number;
};

const getProblemId = (problem: CodeforcesProblem) =>
  `${problem.contestId}_${problem.index}`;

// Build a map from problem id (`${contestId}_${index}`) to the earliest
// accepted submission time in milliseconds.
const toSolvedAtMap = (solvedProblems: SolvedProblem[]) => {
  const map = new Map<string, number>();
  for (const { problem, solvedAt } of solvedProblems) {
    map.set(getProblemId(problem), solvedAt);
  }
  return map;
};

const getSolvedProblems = async (
  user: User,
): Promise<Response<SolvedProblem[]>> => {
  try {
    const res = await getSubmissions(user);
    if (!res.success) {
      return ErrorResponse(res.error);
    }
    const submissions = res.data;

    // Keep the earliest accepted submission per problem
    const solvedById = new Map<string, SolvedProblem>();
    for (const submission of submissions) {
      if (submission.verdict !== "OK") {
        continue;
      }
      const id = getProblemId(submission.problem);
      const solvedAt = submission.creationTimeSeconds * 1000;
      const existing = solvedById.get(id);
      if (!existing || solvedAt < existing.solvedAt) {
        solvedById.set(id, { problem: submission.problem, solvedAt });
      }
    }

    return SuccessResponse(Array.from(solvedById.values()));
  } catch (error) {
    return ErrorResponse((error as Error).message);
  }
};

export default getSolvedProblems;
export { getProblemId, toSolvedAtMap };
export type { SolvedProblem };
