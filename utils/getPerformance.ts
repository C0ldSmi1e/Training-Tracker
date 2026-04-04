import { Training } from "@/types/Training";

const getPerformance = (training: Training) => {
  const level = parseInt(training.level.level);

  // Extract problem ratings (EFGH columns)
  const ratings = training.problems.map((p) => p.rating);

  // Calculate solved times (IJKL columns)
  // Subtract startTime to get relative solving time
  const solvedTimes = training.problems.map((p) =>
    p.solvedTime ? (p.solvedTime - training.startTime) / 60000 : null,
  );

  // Helper function to calculate max threshold based on level
  const getMaxThreshold = (isLastProblem: boolean) => {
    const base = isLastProblem ? 120 : 135;
    const max = isLastProblem ? 180 : 195;
    return Math.max(base, Math.min(max, base + 2.5 * (level - 52)));
  };

  // Main calculation logic following the Excel formula
  let performance;

  if (solvedTimes[3] === null) {
    // L column is blank
    if (solvedTimes[2] === null) {
      // K column is blank
      if (solvedTimes[1] === null) {
        // J column is blank
        if (solvedTimes[0] === null) {
          // I column is blank
          performance = ratings[0] - 50;
        } else {
          const maxThreshold = getMaxThreshold(false);
          performance =
            (solvedTimes[0] / maxThreshold) * ratings[0] +
            ((maxThreshold - solvedTimes[0]) / maxThreshold) * ratings[1];
        }
      } else {
        const maxThreshold = getMaxThreshold(false);
        performance =
          (solvedTimes[1] / maxThreshold) * ratings[1] +
          ((maxThreshold - solvedTimes[1]) / maxThreshold) * ratings[2];
      }
    } else {
      const maxThreshold = getMaxThreshold(false);
      performance =
        (solvedTimes[2] / maxThreshold) * ratings[2] +
        ((maxThreshold - solvedTimes[2]) / maxThreshold) * ratings[3];
    }
  } else {
    const maxThreshold = getMaxThreshold(true);
    performance =
      (solvedTimes[3] / maxThreshold) * ratings[3] +
      ((maxThreshold - solvedTimes[3]) / maxThreshold) * (ratings[3] + 400) +
      ((level - 1) % 4) * 12.5;
  }

  return Math.round(performance);
};

export default getPerformance;
