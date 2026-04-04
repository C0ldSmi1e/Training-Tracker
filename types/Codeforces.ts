/*
  handle	String. Codeforces user handle.
  name	String. Can be absent. User's name if available.
*/

type Member = {
  handle: string;
  name: string;
};

/*
  contestId	Integer. Can be absent. Id of the contest, in which party is participating.
  members	List of Member objects. Members of the party.
  participantType	Enum: CONTESTANT, PRACTICE, VIRTUAL, MANAGER, OUT_OF_COMPETITION.
  teamId	Integer. Can be absent. If party is a team, then it is a unique team id. Otherwise, this field is absent.
  teamName	String. Localized. Can be absent. If party is a team or ghost, then it is a localized name of the team. Otherwise, it is absent.
  ghost	Boolean. If true then this party is a ghost. It participated in the contest, but not on Codeforces. For example, Andrew Stankevich Contests in Gym has ghosts of the participants from Petrozavodsk Training Camp.
  room	Integer. Can be absent. Room of the party. If absent, then the party has no room.
  startTimeSeconds	Integer. Can be absent. Time, when this party started a contest.
*/

type Party = {
  contestId: number;
  members: Member[];
  participantType: string;
  teamId: number;
  teamName: string;
  ghost: boolean;
  room: number;
  startTimeSeconds: number;
};

/*
  contestId	Integer. Can be absent. Id of the contest, containing the problem.
  problemsetName	String. Can be absent. Short name of the problemset the problem belongs to.
  index	String. Usually, a letter or letter with digit(s) indicating the problem index in a contest.
  name	String. Localized.
  type	Enum: PROGRAMMING, QUESTION.
  points	Floating point number. Can be absent. Maximum amount of points for the problem.
  rating	Integer. Can be absent. Problem rating (difficulty).
  tags	String list. Problem tags.
*/

type CodeforcesProblem = {
  contestId: number;
  problemsetName: string;
  index: string;
  name: string;
  type: string;
  points: number;
  rating: number;
  tags: string[];
};

/*
  id	Integer.
  contestId	Integer. Can be absent.
  creationTimeSeconds	Integer. Time, when submission was created, in unix-format.
  relativeTimeSeconds	Integer. Number of seconds, passed after the start of the contest (or a virtual start for virtual parties), before the submission.
  problem	Problem object.
  author	Party object.
  programmingLanguage	String.
  verdict	Enum: FAILED, OK, PARTIAL, COMPILATION_ERROR, RUNTIME_ERROR, WRONG_ANSWER, PRESENTATION_ERROR, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, IDLENESS_LIMIT_EXCEEDED, SECURITY_VIOLATED, CRASHED, INPUT_PREPARATION_CRASHED, CHALLENGED, SKIPPED, TESTING, REJECTED. Can be absent.
  testset	Enum: SAMPLES, PRETESTS, TESTS, CHALLENGES, TESTS1, ..., TESTS10. Testset used for judging the submission.
  passedTestCount	Integer. Number of passed tests.
  timeConsumedMillis	Integer. Maximum time in milliseconds, consumed by solution for one test.
  memoryConsumedBytes	Integer. Maximum memory in bytes, consumed by solution for one test.
  points	Floating point number. Can be absent. Number of scored points for IOI-like contests.
*/

type CodeforcesSubmission = {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: CodeforcesProblem;
  author: Party;
  programmingLanguage: string;
  verdict: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  points: number;
};

type ProblemTag = {
  name: string;
  value: string;
};

export type { CodeforcesProblem, CodeforcesSubmission, ProblemTag };
