import Link from "next/link";
import { TrainingProblem } from "@/types/TrainingProblem";
import { Training } from "@/types/Training";
import CountDown from "@/components/CountDown";
import { ProblemTag } from "@/types/Codeforces";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

const ProblemLink = ({
  problem,
  isTraining,
  startTime,
}: {
  problem: TrainingProblem;
  isTraining: boolean;
  startTime: number | null;
}) => {
  const getSolvedStatus = () => {
    if (!isTraining) return "";
    if (problem.solvedTime && startTime) {
      const solvedMinutes = Math.floor(
        (problem.solvedTime - startTime) / 60000,
      );
      return `✅ ${solvedMinutes}m `;
    }
    return "⌛ ";
  };

  return (
    <Link
      className="text-primary hover:underline"
      href={problem.url}
      target="_blank"
    >
      {getSolvedStatus()}
      {problem.contestId}-{problem.index}
    </Link>
  );
};

const Trainer = ({
  isTraining,
  training,
  problems,
  generateProblems,
  startTraining,
  stopTraining,
  refreshProblemStatus,
  finishTraining,
  selectedTags,
  lb,
  ub,
}: {
  isTraining: boolean;
  training: Training | null;
  problems: TrainingProblem[] | null;
  generateProblems: (tags: ProblemTag[], lb: number, ub: number) => void;
  startTraining: () => void;
  stopTraining: () => void;
  refreshProblemStatus: () => void;
  finishTraining: () => void;
  selectedTags: ProblemTag[];
  lb: number;
  ub: number;
}) => {
  const onFinishTraining = () => {
    if (confirm("Are you sure to finish the training?")) {
      finishTraining();
    }
  };

  const onStopTraining = () => {
    if (confirm("Are you sure to stop the training?")) {
      stopTraining();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-wrap justify-between gap-4">
          {(isTraining && training?.problems
            ? training.problems
            : problems
          )?.map((problem) => (
            <ProblemLink
              key={`${problem.contestId}-${problem.index}`}
              problem={problem}
              isTraining={isTraining}
              startTime={training?.startTime ?? null}
            />
          ))}
        </div>
        {isTraining && (
          <Button variant="outline" size="sm" onClick={refreshProblemStatus}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        )}
        <div className="flex justify-center gap-4">
          {!isTraining ? (
            <>
              <Button onClick={() => generateProblems(selectedTags, lb, ub)}>
                {problems && problems.length > 0
                  ? "Regenerate"
                  : "Generate Problems"}
              </Button>
              {problems && problems.length > 0 && (
                <Button onClick={startTraining}>Start</Button>
              )}
            </>
          ) : (
            training && (
              <div className="flex flex-col items-center gap-4">
                <CountDown
                  startTime={training.startTime}
                  endTime={training.endTime}
                />
                <div className="flex gap-4">
                  <Button onClick={onFinishTraining}>Finish</Button>
                  <Button variant="destructive" onClick={onStopTraining}>
                    Stop
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Trainer;
