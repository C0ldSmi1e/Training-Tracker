import { SuccessResponse, ErrorResponse } from "@/types/Response";

const getUser = async (codeforcesHandle: string) => {
  try {
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${codeforcesHandle}`,
    );
    const data = await res.json();
    if (data.status === "OK") {
      return SuccessResponse(data.result[0]);
    }
    return ErrorResponse("User not found");
  } catch (error) {
    return ErrorResponse((error as Error).message);
  }
};

export default getUser;
