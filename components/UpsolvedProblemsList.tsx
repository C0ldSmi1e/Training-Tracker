import { TrainingProblem } from "@/types/TrainingProblem";
import Link from "next/link";
import StatusIcon from "@/components/StatusIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const UpsolvedProblemsList = ({
  upsolvedProblems,
  onDelete,
  onRefresh,
}: {
  upsolvedProblems: TrainingProblem[];
  onDelete: (problem: TrainingProblem) => void;
  onRefresh: () => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight">
          Upsolve
        </h1>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw />
          Refresh
        </Button>
      </div>
      <Card className="py-1">
        <ul className="divide-y">
          {upsolvedProblems.map((problem) => {
            const isSolved = Boolean(problem.solvedTime);
            return (
              <li
                key={problem.contestId + problem.index}
                className="flex min-h-16 items-center gap-3.5 pl-6 pr-2"
              >
                <StatusIcon solved={isSolved} className="size-5" />
                <Link
                  className="group flex min-h-12 min-w-0 flex-1 flex-col justify-center"
                  href={problem.url}
                  target="_blank"
                >
                  <span className="truncate font-medium group-hover:text-link group-hover:underline">
                    {problem.name}
                  </span>
                  <span className="font-mono text-[13px] text-muted-foreground">
                    {problem.contestId}-{problem.index}
                  </span>
                </Link>
                <span
                  className={cn(
                    "whitespace-nowrap text-[13px]",
                    isSolved
                      ? "font-semibold text-success"
                      : "text-muted-foreground",
                  )}
                >
                  {isSolved ? "Solved" : "Not solved"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${problem.name}`}
                  onClick={() => onDelete(problem)}
                >
                  <Trash2 />
                </Button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
};

export default UpsolvedProblemsList;
