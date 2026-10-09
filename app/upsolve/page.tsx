"use client";

import { TrainingProblem } from "@/types/TrainingProblem";
import useUpsolvedProblems from "@/hooks/useUpsolvedProblems";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import UpsolvedProblemsList from "@/components/UpsolvedProblemsList";
import { Card } from "@/components/ui/card";

const Upsolve = () => {
  const {
    upsolvedProblems,
    isLoading,
    error,
    deleteUpsolvedProblem,
    onRefreshUpsolvedProblems,
  } = useUpsolvedProblems();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  const onDelete = (problem: TrainingProblem) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      deleteUpsolvedProblem(problem);
    }
  };

  if (!upsolvedProblems || upsolvedProblems.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight">
          Upsolve
        </h1>
        <Card className="px-6 py-12 text-center text-muted-foreground">
          No problems to upsolve.
        </Card>
      </div>
    );
  }

  return (
    <UpsolvedProblemsList
      upsolvedProblems={upsolvedProblems}
      onDelete={onDelete}
      onRefresh={onRefreshUpsolvedProblems}
    />
  );
};

export default Upsolve;
