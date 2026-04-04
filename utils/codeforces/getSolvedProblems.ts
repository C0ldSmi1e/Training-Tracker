import { User } from "@/types/User";
import { CodeforcesProblem, CodeforcesSubmission } from "@/types/Codeforces";
import { SuccessResponse, ErrorResponse, Response } from "@/types/Response";
import getSubmissions from "@/utils/codeforces/getSubmissions";

const getSolvedProblems = async (
  user: User,
): Promise<Response<CodeforcesProblem[]>> => {
  try {
    const res = await getSubmissions(user);
    if (!res.success) {
      return ErrorResponse(res.error);
    }
    const submissions = res.data;
    const problems = submissions
      .filter((submission: CodeforcesSubmission) => submission.verdict === "OK")
      .map((submission: CodeforcesSubmission) => submission.problem);

    return SuccessResponse(problems);
  } catch (error) {
    return ErrorResponse((error as Error).message);
  }
};

export default getSolvedProblems;
