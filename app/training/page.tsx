"use client";

import { useState } from "react";

import useUser from "@/hooks/useUser";
import useTraining from "@/hooks/useTraining";
import Trainer from "@/components/Trainer";
import TagSelector from "@/components/TagSelector";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import useTags from "@/hooks/useTags";
import useBounds from "@/hooks/useBounds";
import { Card } from "@/components/ui/card";
import { Textboxpair } from "@/components/ui/textboxpair";
import { cn } from "@/lib/utils";

const Stat = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) => {
  return (
    <div className="flex-[1_1_180px] bg-card px-5 py-3.5">
      <div className="text-[13px] text-muted-foreground">{label}</div>
      <div className="font-mono text-[22px] font-medium tracking-tight">
        {value}
        {unit && (
          <span className="font-sans text-[15px] font-normal tracking-normal text-foreground-soft">
            {" "}
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

const Training = () => {
  const { user } = useUser();
  const { allTags, selectedTags, onTagClick, onClearTags } = useTags();
  const {
    startTraining,
    stopTraining,
    problems,
    training,
    isTraining,
    isLoading,
    refreshProblemStatus,
    finishTraining,
    generateProblems,
  } = useTraining();
  const { firstInput, secondInput, onFirstInputChange, onSecondInputChange } =
    useBounds();
  const [showRatings, setShowRatings] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  if (!user || !problems) {
    return <Error />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight">
        Training
      </h1>
      <div className="flex flex-wrap gap-px overflow-hidden rounded-lg border bg-border">
        <Stat label="Level" value={user.level.level} />
        <Stat label="Target performance" value={user.level.Performance} />
        <Stat label="Session time" value={user.level.time} unit="min" />
      </div>
      {/* Hidden rather than unmounted during a session, so the tag panel and
          the uncontrolled contest-range inputs keep what the user entered */}
      <Card className={cn("px-6 pb-5 pt-3.5", isTraining && "hidden")}>
        <TagSelector
          allTags={allTags}
          selectedTags={selectedTags}
          onTagClick={onTagClick}
          onClearTags={onClearTags}
        />
        <div className="mb-3.5 mt-[18px] h-px bg-border" />
        <div className="flex flex-wrap items-start gap-x-6">
          <h2 className="w-[120px] shrink-0 pb-2 pt-1 font-semibold">
            Contest range
          </h2>
          <Textboxpair
            className="min-w-0 flex-[1_1_320px]"
            onFirstInputChange={onFirstInputChange}
            onSecondInputChange={onSecondInputChange}
          />
        </div>
      </Card>
      <Trainer
        isTraining={isTraining}
        training={training}
        problems={problems}
        ratings={[user.level.P1, user.level.P2, user.level.P3, user.level.P4]}
        showRatings={showRatings}
        onToggleRatings={() => setShowRatings(!showRatings)}
        generateProblems={generateProblems}
        startTraining={startTraining}
        stopTraining={stopTraining}
        refreshProblemStatus={refreshProblemStatus}
        finishTraining={finishTraining}
        selectedTags={selectedTags}
        lb={firstInput}
        ub={secondInput}
      />
    </div>
  );
};

export default Training;
