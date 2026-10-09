"use client";

import useHistory from "@/hooks/useHistory";
import Loader from "@/components/Loader";
import History from "@/components/History";
import ProgressChart from "@/components/ProgressChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const Statistics = () => {
  const { history, isLoading, deleteTraining, clearHistory } = useHistory();

  if (isLoading) {
    return <Loader />;
  }

  const onClearHistory = () => {
    if (
      confirm(
        "Are you sure to clear the history? This action cannot be undone.",
      )
    ) {
      clearHistory();
    }
  };

  const onExportJson = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "history.json";
    a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight">
          Statistics
        </h1>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="pl-[18px] pr-3.5">
                Export
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={!history || history.length === 0}
                onClick={onExportJson}
                className="cursor-pointer"
              >
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem disabled>CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="destructive" onClick={onClearHistory}>
            Clear
          </Button>
        </div>
      </div>
      {history && history.length > 0 ? (
        <>
          <ProgressChart history={history} />
          <History history={history} deleteTraining={deleteTraining} />
        </>
      ) : (
        <Card className="px-6 py-12 text-center text-muted-foreground">
          No training history
        </Card>
      )}
    </div>
  );
};

export default Statistics;
