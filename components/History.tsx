import Link from "next/link";
import { Training } from "@/types/Training";
import { TrainingProblem } from "@/types/TrainingProblem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Problem = ({
  problem,
  startTime,
}: {
  problem: TrainingProblem;
  startTime: number;
}) => {
  const isSolved = Boolean(problem.solvedTime);

  return (
    <Link
      className="group flex min-h-11 items-center whitespace-nowrap"
      href={problem.url}
      target="_blank"
    >
      {isSolved ? (
        <Check
          aria-label="Solved"
          className="mr-1.5 size-3.5 shrink-0 text-success"
          strokeWidth={3}
        />
      ) : (
        <X
          aria-label="Not solved"
          className="mr-1.5 size-3.5 shrink-0 text-input"
          strokeWidth={3}
        />
      )}
      <span
        className={cn(
          "mr-1 min-w-9 font-mono text-[13px]",
          isSolved ? "text-foreground-soft" : "text-muted-foreground",
        )}
      >
        {problem.solvedTime
          ? `${Math.floor((problem.solvedTime - startTime) / 60000)}m`
          : "—"}
      </span>
      <span className="font-mono text-sm font-medium group-hover:text-link group-hover:underline">
        {problem.contestId}-{problem.index}
      </span>
    </Link>
  );
};

const History = ({
  history,
  deleteTraining,
}: {
  history: Training[];
  deleteTraining: (training: Training) => void;
}) => {
  const onDelete = (training: Training) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteTraining(training);
    }
  };

  return (
    <Card className="py-2">
      <h2 className="px-6 pb-2 pt-3 font-semibold">History</h2>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6">Date</TableHead>
            <TableHead>Level</TableHead>
            {history[0]?.problems.map((_, index) => (
              <TableHead key={`p-${index}`} className="px-2">
                P{index + 1}
              </TableHead>
            ))}
            <TableHead>Performance</TableHead>
            <TableHead className="w-11 pr-2">
              <span className="sr-only">Delete</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((training) => (
            <TableRow key={training.startTime}>
              <TableCell className="whitespace-nowrap pl-6 text-foreground-soft">
                {new Date(training.startTime).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {training.level.level}
              </TableCell>
              {training.problems.map((p) => (
                <TableCell key={`${p.contestId}-${p.index}`} className="px-2">
                  <Problem problem={p} startTime={training.startTime} />
                </TableCell>
              ))}
              <TableCell className="font-mono font-semibold">
                {training.performance}
              </TableCell>
              <TableCell className="pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete this record"
                  onClick={() => onDelete(training)}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default History;
