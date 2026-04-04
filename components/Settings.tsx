"use client";

import { useState } from "react";
import useUser from "@/hooks/useUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [codeforcesHandle, setCodeforcesHandle] = useState("");
  const { updateUser } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeCodeforcesHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeforcesHandle(e.target.value);
  };

  const onUpdateUser = async () => {
    if (!codeforcesHandle.trim()) {
      return;
    }

    setErrorMessage("");
    setIsUpdating(true);
    const res = await updateUser(codeforcesHandle);
    if (!res.success) {
      setErrorMessage(res.error);
    }
    setIsUpdating(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onUpdateUser();
    }
  };

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
        <Input
          type="text"
          className="w-full md:w-2/3"
          value={codeforcesHandle}
          onChange={onChangeCodeforcesHandle}
          onKeyDown={onKeyDown}
          placeholder="Please enter your Codeforces handle"
        />
        <Button
          className="w-full md:w-1/3"
          onClick={onUpdateUser}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </div>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default Settings;