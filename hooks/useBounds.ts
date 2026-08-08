import { useState } from "react";

const DEFAULT_LOWER_BOUND = 1;
const DEFAULT_UPPER_BOUND = 3000;

const useBounds = () => {
  const [firstInput, setFirstInput] = useState(DEFAULT_LOWER_BOUND);
  const [secondInput, setSecondInput] = useState(DEFAULT_UPPER_BOUND);

  const onFirstInputChange = (val: string) => {
    const parsed = parseInt(val);
    setFirstInput(Number.isNaN(parsed) ? DEFAULT_LOWER_BOUND : parsed);
  };

  const onSecondInputChange = (val: string) => {
    const parsed = parseInt(val);
    setSecondInput(Number.isNaN(parsed) ? DEFAULT_UPPER_BOUND : parsed);
  };

  return {
    firstInput,
    secondInput,
    onFirstInputChange,
    onSecondInputChange,
  };
};

export default useBounds;
