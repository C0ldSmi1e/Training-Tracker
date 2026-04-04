import Link from "next/link";
import { Training } from "@/types/Training";
import { TrainingProblem } from "@/types/TrainingProblem";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const Problem = ({ problem, startTime }: { problem: TrainingProblem; startTime: number }) => {
  const getSolvedStatus = () => {
    if (problem.solvedTime) {
      const solvedMinutes = Math.floor((problem.solvedTime - startTime) / 60000);
      return `✅ ${solvedMinutes}m `;
    }
    return "❌ ";
  };
  return (
    <Link
      className="text-primary hover:underline duration-300"
      href={problem.url}
      target="_blank"
    >
      {getSolvedStatus()}
      {problem.contestId}-{problem.index}
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
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Level</TableHead>
            {history[0]?.problems.map((_, index) => (
              <TableHead key={`p-${index}`}>P{index + 1}</TableHead>
            ))}
            <TableHead>Performance</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((training) => (
            <TableRow key={training.startTime}>
              <TableCell>{new Date(training.startTime).toLocaleDateString()}</TableCell>
              <TableCell>{training.level.level}</TableCell>
              {training.problems.map((p) => (
                <TableCell key={p.contestId}>
                  <Problem problem={p} startTime={training.startTime} />
                </TableCell>
              ))}
              <TableCell>{training.performance}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onDelete(training)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default History;

