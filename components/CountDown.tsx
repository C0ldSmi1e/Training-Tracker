import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";

const calculateTime = (startTime: number, endTime: number) => {
  const now = Date.now();
  if (now < startTime) return { timeLeft: startTime - now, isStarted: false };
  if (now < endTime) return { timeLeft: endTime - now, isStarted: true };
  return { timeLeft: 0, isStarted: true };
};

const CountDown = ({
  startTime,
  endTime,
}: {
  startTime: number;
  endTime: number;
}) => {
  const initial = useMemo(
    () => calculateTime(startTime, endTime),
    [startTime, endTime],
  );
  const [timeLeft, setTimeLeft] = useState<number>(initial.timeLeft);
  const [isStarted, setIsStarted] = useState<boolean>(initial.isStarted);

  useEffect(() => {
    const timer = setInterval(() => {
      const { timeLeft: remaining, isStarted: started } = calculateTime(
        startTime,
        endTime,
      );
      setTimeLeft(remaining);
      setIsStarted(started);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const duration = endTime - startTime;
  const elapsed = isStarted ? duration - timeLeft : 0;
  const progress = duration > 0 ? Math.round((elapsed / duration) * 100) : 0;

  return (
    <Card className="px-6 pb-[22px] pt-6 text-center">
      {timeLeft === 0 ? (
        <div className="py-6 text-2xl font-semibold">
          {isStarted ? (
            <span className="text-destructive">Training has ended</span>
          ) : (
            <span className="text-success">Training will start soon</span>
          )}
        </div>
      ) : (
        <>
          <div className="text-[13px] text-muted-foreground">
            {isStarted ? "Time left" : "Training will start in"}
          </div>
          <div className="font-mono text-[clamp(48px,8vw,84px)] font-medium leading-[1.15] tracking-[-0.04em]">
            {hours}:{minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </div>
        </>
      )}
      <div
        role="progressbar"
        aria-label="Session progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="mx-auto mt-3.5 h-1.5 max-w-[520px] overflow-hidden rounded-full bg-border"
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mx-auto mt-2 flex max-w-[520px] justify-between gap-3 text-[13px] text-muted-foreground">
        <span>{Math.floor(elapsed / 60000)} min elapsed</span>
        <span>{Math.round(duration / 60000)} min</span>
      </div>
    </Card>
  );
};

export default CountDown;
