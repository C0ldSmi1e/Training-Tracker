import { useState } from "react";
import { X } from "lucide-react";
import { ProblemTag } from "@/types/Codeforces";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chipClassName =
  "inline-flex h-[34px] items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const selectedChipClassName = "border-primary bg-accent text-accent-foreground";
const unselectedChipClassName =
  "border-border-strong bg-card text-foreground-soft hover:text-foreground";

const TagSelector = ({
  allTags,
  selectedTags,
  onTagClick,
  onClearTags,
}: {
  allTags: ProblemTag[];
  selectedTags: ProblemTag[];
  onTagClick: (tag: ProblemTag) => void;
  onClearTags: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSelection = selectedTags.length > 0;

  return (
    <div>
      <div className="flex flex-wrap items-start gap-x-6">
        <h2 className="w-[120px] shrink-0 pt-2.5 font-semibold">Tags</h2>
        <div className="min-w-0 flex-[1_1_320px]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            {!hasSelection && (
              <span className="py-2.5 text-muted-foreground">Any tag</span>
            )}
            {selectedTags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                aria-label={`Remove ${tag.name}`}
                className={cn(chipClassName, selectedChipClassName, "pr-2.5")}
                onClick={() => onTagClick(tag)}
              >
                {tag.name}
                <X className="size-3.5" strokeWidth={2.5} />
              </button>
            ))}
            <Button
              variant="link"
              className="px-2"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "Done" : hasSelection ? "Edit tags" : "Choose tags"}
            </Button>
            {hasSelection && (
              <Button
                variant="ghost"
                className="px-2 font-medium hover:bg-transparent"
                onClick={onClearTags}
              >
                Clear all
              </Button>
            )}
          </div>
          <p className="text-[13px] text-muted-foreground">
            Problems will be generated randomly if no tags are selected.
          </p>
        </div>
      </div>
      {isOpen && (
        <div className="mt-3.5 flex flex-wrap gap-2 rounded-md bg-muted p-3">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag.value}
                type="button"
                aria-pressed={isSelected}
                className={cn(
                  chipClassName,
                  isSelected ? selectedChipClassName : unselectedChipClassName,
                )}
                onClick={() => onTagClick(tag)}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
