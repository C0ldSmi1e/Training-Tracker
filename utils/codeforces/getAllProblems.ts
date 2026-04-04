import { CodeforcesProblem } from "@/types/Codeforces";
import { SuccessResponse, ErrorResponse, Response } from "@/types/Response";

// Filter out Kotlin, Microsoft Q# and April Fools Day Contests
const filteredContestIds = [
  171, 290, 409, 784, 952, 1145, 1171, 1170, 1212, 1211, 1298, 1297, 1331, 1347,
  1346, 1489, 1488, 1505, 1532, 1533, 1570, 1571, 1663, 1812, 1911, 1910, 1952,
  1959, 1958, 2012, 2011, 1001, 1002, 1115, 1116, 1356, 1357,
];

const getAllProblems = async (): Promise<Response<CodeforcesProblem[]>> => {
  try {
    const res = await fetch("https://codeforces.com/api/problemset.problems");
    const data = await res.json();
    if (data.status !== "OK") {
      return ErrorResponse("Failed to fetch problems");
    }
    const problems = data.result.problems
      .filter((problem: CodeforcesProblem) => problem.contestId >= 700)
      .filter(
        (problem: CodeforcesProblem) =>
          !filteredContestIds.includes(problem.contestId),
      );
    return SuccessResponse(problems);
  } catch (error) {
    return ErrorResponse((error as Error).message);
  }
};

export default getAllProblems;
