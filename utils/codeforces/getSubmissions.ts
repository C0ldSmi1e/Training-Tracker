import { User } from "@/types/User";
import { CodeforcesSubmission } from "@/types/Codeforces";
import { SuccessResponse, ErrorResponse, Response } from "@/types/Response";

const getSubmissions = async (
  user: User,
  from?: number,
  count?: number,
): Promise<Response<CodeforcesSubmission[]>> => {
  try {
    let url = `https://codeforces.com/api/user.status?handle=${user.codeforcesHandle}`;
    if (from) {
      url += `&from=${from}`;
    }
    if (count) {
      url += `&count=${count}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== "OK") {
      return ErrorResponse("Failed to fetch submissions");
    }
    return SuccessResponse(data.result);
  } catch (error) {
    return ErrorResponse((error as Error).message);
  }
};

export default getSubmissions;
