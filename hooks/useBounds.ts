import { useState } from "react";

const DEFAULT_MIN_CONTEST_ID = 1;
const DEFAULT_MAX_CONTEST_ID = 3000;

// Fall back to the default when the input is not a valid number
// (e.g. a cleared textbox parses to NaN)
const parseBound = (val: string, fallback: number) => {
  const parsed = parseInt(val);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const useBounds = () => {
  const [firstInput, setFirstInput] = useState(DEFAULT_MIN_CONTEST_ID);
  const [secondInput, setSecondInput] = useState(DEFAULT_MAX_CONTEST_ID);

  const onFirstInputChange = (val: string) => {
    setFirstInput(parseBound(val, DEFAULT_MIN_CONTEST_ID));
  };

  const onSecondInputChange = (val: string) => {
    setSecondInput(parseBound(val, DEFAULT_MAX_CONTEST_ID));
  };

  return {
    firstInput,
    secondInput,
    onFirstInputChange,
    onSecondInputChange,
  };
};

export default useBounds;
