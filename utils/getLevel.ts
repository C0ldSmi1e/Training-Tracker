import level from "@/public/data/level.json";
import { Level } from "@/types/Level";

const getLevelByRating = (rating: number) => {
  const res = level.findLast(
    (level: Level) => rating >= parseInt(level.Performance),
  );
  return res ? res : level[0];
};

const getLevel = (newLevel: number) => {
  const maxLevel = level.length;
  const minLevel = 1;
  if (newLevel < minLevel) {
    return level[0];
  }
  if (newLevel > maxLevel) {
    return level[maxLevel - 1];
  }
  const res = level.find((level: Level) => +level.level === newLevel);
  return res ? res : level[0];
};

export { getLevelByRating, getLevel };
