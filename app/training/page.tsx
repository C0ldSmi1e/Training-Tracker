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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textboxpair } from "@/components/ui/textboxpair";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Let&apos;s Practice!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <span className="font-bold">Level:</span> {user?.level.level}
          </div>
          <div>
            <span className="font-bold">Performance:</span>{" "}
            {user?.level.Performance}
          </div>
          <div>
            <span className="font-bold">Time:</span> {user?.level.time} minutes
          </div>
        </div>
        <TagSelector
          allTags={allTags}
          selectedTags={selectedTags}
          onTagClick={onTagClick}
          onClearTags={onClearTags}
        />
        <div className="flex flex-col gap-2">
          <div className="flex place-content-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRatings(!showRatings)}
              className="w-fit"
            >
              {showRatings ? "Hide Ratings" : "Show Ratings"}
            </Button>
            <Textboxpair
              onFirstInputChange={onFirstInputChange}
              onSecondInputChange={onSecondInputChange}
            ></Textboxpair>
          </div>

          <div className="flex flex-wrap gap-4 p-4 rounded-lg justify-between">
            <div>
              <span className="font-bold">P1:</span>{" "}
              <span className={!showRatings ? "blur-sm select-none" : ""}>
                {user?.level.P1}
              </span>
            </div>
            <div>
              <span className="font-bold">P2:</span>{" "}
              <span className={!showRatings ? "blur-sm select-none" : ""}>
                {user?.level.P2}
              </span>
            </div>
            <div>
              <span className="font-bold">P3:</span>{" "}
              <span className={!showRatings ? "blur-sm select-none" : ""}>
                {user?.level.P3}
              </span>
            </div>
            <div>
              <span className="font-bold">P4:</span>{" "}
              <span className={!showRatings ? "blur-sm select-none" : ""}>
                {user?.level.P4}
              </span>
            </div>
          </div>
        </div>
        <Trainer
          isTraining={isTraining}
          training={training}
          problems={problems}
          generateProblems={generateProblems}
          startTraining={startTraining}
          stopTraining={stopTraining}
          refreshProblemStatus={refreshProblemStatus}
          finishTraining={finishTraining}
          selectedTags={selectedTags}
          lb={firstInput}
          ub={secondInput}
        />
      </CardContent>
    </Card>
  );
};

export default Training;
