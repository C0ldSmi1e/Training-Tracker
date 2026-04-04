import { useState } from "react";

const useBounds = () => {
  const [firstInput, setFirstInput] = useState(1);
  const [secondInput, setSecondInput] = useState(3000);

  const onFirstInputChange = (val: string) => {
    setFirstInput(parseInt(val));
  };

  const onSecondInputChange = (val: string) => {
    setSecondInput(parseInt(val));
  };

  return {
    firstInput,
    secondInput,
    onFirstInputChange,
    onSecondInputChange,
  };
};

export default useBounds;
