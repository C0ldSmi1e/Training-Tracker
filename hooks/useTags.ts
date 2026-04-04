import { useState } from "react";
import { ProblemTag } from "@/types/Codeforces";
import tagData from "@/public/data/tag.json";

export const useTags = () => {
  const allTags = tagData as ProblemTag[];
  const [selectedTags, setSelectedTags] = useState<ProblemTag[]>([]);

  const onTagClick = (tag: ProblemTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prevTags) =>
        prevTags.filter((t) => t.value !== tag.value),
      );
    } else {
      setSelectedTags((prevTags) => [...prevTags, tag]);
    }
  };

  const onClearTags = () => {
    setSelectedTags([]);
  };

  return {
    allTags,
    selectedTags,
    onTagClick,
    onClearTags,
  };
};

export default useTags;
