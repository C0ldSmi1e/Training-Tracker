import Link from "next/link";
import { TrainingProblem } from "@/types/TrainingProblem";
import { Training } from "@/types/Training";
import CountDown from "@/components/CountDown";
import StatusIcon from "@/components/StatusIcon";
import { ProblemTag } from "@/types/Codeforces";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const HIDDEN_RATING = "••••";

const ProblemTile = ({
  slot,
  rating,
  problem,
  isTraining,
  startTime,
}: {
  slot: number;
  rating: string;
  problem?: TrainingProblem;
  isTraining: boolean;
  startTime: number | null;
}) => {
  const isSolved = Boolean(isTraining && problem?.solvedTime && startTime);

  const content = (
    <>
      <span
        className={cn(
          "flex items-baseline justify-between gap-2 text-[13px]",
          isSolved ? "text-foreground-soft" : "text-muted-foreground",
        )}
      >
        <span>P{slot}</span>
        <span className="font-mono">{rating}</span>
      </span>
      <span className="flex items-center gap-1.5 font-mono text-xl font-medium tracking-tight">
        {problem ? (
          <>
            {problem.contestId}-{problem.index}
            <ArrowUpRight className="size-4 text-link" />
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </span>
      {isTraining && problem && (
        <span
          className={cn(
            "flex items-center gap-2 text-[13px]",
            isSolved ? "font-medium" : "text-muted-foreground",
          )}
        >
          <StatusIcon solved={isSolved} />
          {isSolved && problem.solvedTime && startTime
            ? `Solved at ${Math.floor((problem.solvedTime - startTime) / 60000)} min`
            : "Not solved yet"}
        </span>
      )}
    </>
  );

  const className = cn(
    "flex flex-col gap-2 rounded-md border px-4 pb-4 pt-3.5",
    isSolved
      ? "border-success-border bg-success-muted"
      : isTraining
        ? "bg-card"
        : "bg-muted",
  );

  if (!problem) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link
      className={cn(className, "transition-colors hover:border-input")}
      href={problem.url}
      target="_blank"
    >
      {content}
    </Link>
  );
};

const Trainer = ({
  isTraining,
  training,
  problems,
  ratings,
  showRatings,
  onToggleRatings,
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
  ratings: string[];
  showRatings: boolean;
  onToggleRatings: () => void;
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

  const shownProblems =
    (isTraining && training?.problems ? training.problems : problems) ?? [];
  const hasProblems = Boolean(problems && problems.length > 0);
  const slotCount = Math.max(ratings.length, shownProblems.length);

  const ratingsToggle = (
    <Button variant="link" className="px-2" onClick={onToggleRatings}>
      {showRatings ? "Hide ratings" : "Show ratings"}
    </Button>
  );

  const tiles = (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: slotCount }, (_, i) => {
        const problem = shownProblems[i];
        return (
          <ProblemTile
            key={problem ? `${problem.contestId}-${problem.index}` : i}
            slot={i + 1}
            rating={showRatings && ratings[i] ? ratings[i] : HIDDEN_RATING}
            problem={problem}
            isTraining={isTraining}
            startTime={training?.startTime ?? null}
          />
        );
      })}
    </div>
  );

  if (isTraining && training) {
    return (
      <>
        <CountDown startTime={training.startTime} endTime={training.endTime} />
        {tiles}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Button variant="outline" onClick={refreshProblemStatus}>
              <RefreshCw />
              Refresh status
            </Button>
            {ratingsToggle}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive" onClick={onStopTraining}>
              Stop
            </Button>
            <Button className="px-[26px]" onClick={onFinishTraining}>
              Finish session
            </Button>
          </div>
        </div>
        <p className="-mt-1.5 text-[13px] text-muted-foreground sm:text-right">
          Finish saves this session to your history. Stop discards it.
        </p>
      </>
    );
  }

  return (
    <Card className="px-6 pb-6 pt-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Problems</h2>
        {ratingsToggle}
      </div>
      <div className="mt-1">{tiles}</div>
      {!isTraining && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {hasProblems ? (
            <>
              <Button
                variant="outline"
                onClick={() => generateProblems(selectedTags, lb, ub)}
              >
                Regenerate
              </Button>
              <Button className="px-[26px]" onClick={startTraining}>
                Start session
              </Button>
            </>
          ) : (
            <Button
              className="ml-auto px-[26px]"
              onClick={() => generateProblems(selectedTags, lb, ub)}
            >
              Generate problems
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default Trainer;
