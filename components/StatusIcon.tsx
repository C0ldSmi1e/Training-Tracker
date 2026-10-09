import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const StatusIcon = ({
  solved,
  className,
}: {
  solved: boolean;
  className?: string;
}) => {
  if (solved) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded-full bg-success text-success-foreground",
          className,
        )}
      >
        <Check className="size-3" strokeWidth={3.5} />
      </span>
    );
  }

  return (
    <Circle
      aria-hidden="true"
      className={cn("size-[18px] shrink-0 text-input", className)}
    />
  );
};

export default StatusIcon;
