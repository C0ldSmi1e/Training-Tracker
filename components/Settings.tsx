"use client";

import { useState } from "react";
import useUser from "@/hooks/useUser";
import { Card } from "@/components/ui/card";
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
    <Card className="p-6">
      <label htmlFor="codeforces-handle" className="font-semibold">
        Codeforces handle
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Input
          id="codeforces-handle"
          type="text"
          className="sm:flex-1"
          value={codeforcesHandle}
          onChange={onChangeCodeforcesHandle}
          onKeyDown={onKeyDown}
          placeholder="Please enter your Codeforces handle"
        />
        <Button onClick={onUpdateUser} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </div>
      {errorMessage && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </Card>
  );
};

export default Settings;
