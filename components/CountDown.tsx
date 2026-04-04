import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold text-center">
          {timeLeft === 0 ? (
            isStarted ? (
              <span className="text-red-500">Training has ended</span>
            ) : (
              <span className="text-green-500">Training will start soon</span>
            )
          ) : (
            <span>
              {!isStarted && "Training will start in "}
              {hours.toString().padStart(2, "0")}:
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CountDown;
