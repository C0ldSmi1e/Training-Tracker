import { Training } from "@/types/Training";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

const Y_TICK_STEP = 200;

const formatDay = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const ChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Training }[];
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const training = payload[0].payload;

  return (
    <div className="rounded-sm border border-border-strong bg-popover px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2 font-mono text-sm font-semibold">
        <span
          aria-hidden="true"
          className="h-0.5 w-3.5 rounded-full bg-chart-1"
        />
        {training.performance}
      </div>
      <div className="text-xs text-muted-foreground">
        {formatDay(training.startTime)} · Level {training.level.level}
      </div>
    </div>
  );
};

const ProgressChart = ({ history }: { history: Training[] }) => {
  const performances = history.map((training) => training.performance);
  const yMin =
    Math.floor((Math.min(...performances) - 1) / Y_TICK_STEP) * Y_TICK_STEP;
  const yMax =
    Math.ceil((Math.max(...performances) + 1) / Y_TICK_STEP) * Y_TICK_STEP;
  const yTicks = [];
  for (let tick = yMin; tick <= yMax; tick += Y_TICK_STEP) {
    yTicks.push(tick);
  }

  const axisTick = {
    fill: "hsl(var(--muted-foreground))",
    fontSize: 11,
    fontFamily: "var(--font-geist-mono)",
  };

  // Label only the latest session; the axis, tooltip and table carry the rest
  const renderLatestLabel = ({
    x,
    y,
    index,
    value,
  }: {
    x?: number | string;
    y?: number | string;
    index?: number;
    value?: number | string;
  }) => {
    if (index !== history.length - 1) {
      return null;
    }

    return (
      <text
        x={Number(x) + 12}
        y={Number(y) + 4}
        fill="hsl(var(--foreground))"
        fontSize={12}
        fontWeight={600}
        fontFamily="var(--font-geist-mono)"
      >
        {value}
      </text>
    );
  };

  return (
    <Card className="px-6 pb-5 pt-[18px]">
      <h2 className="mb-3.5 font-semibold">
        Performance{" "}
        <span className="font-normal text-muted-foreground">per session</span>
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={history}
          margin={{ top: 8, right: 48, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="startTime"
            tickFormatter={formatDay}
            interval="preserveStartEnd"
            minTickGap={16}
            tickMargin={10}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border-strong))" }}
            tick={axisTick}
          />
          <YAxis
            domain={[yMin, yMax]}
            ticks={yTicks}
            width={44}
            tickMargin={8}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "hsl(var(--input))", strokeWidth: 1 }}
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="performance"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            dot={{
              r: 4.5,
              fill: "hsl(var(--chart-1))",
              fillOpacity: 1,
              stroke: "hsl(var(--card))",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6.5,
              fill: "hsl(var(--chart-1))",
              stroke: "hsl(var(--card))",
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          >
            <LabelList dataKey="performance" content={renderLatestLabel} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProgressChart;
