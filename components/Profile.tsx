"use client";

import { useState } from "react";

import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Response } from "@/types/Response";

const Profile = ({
  user,
  logout,
  changeUserLevel,
}: {
  user: User;
  logout: () => void;
  changeUserLevel: (newLevelNumber: number) => Promise<Response<string>>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newLevelNumber, setNewLevelNumber] = useState<number>(
    +user?.level.level,
  );

  const onSave = async () => {
    setIsLoading(true);
    await changeUserLevel(newLevelNumber);
    setIsEditing(false);
    setIsLoading(false);
  };

  const onCancel = () => {
    setNewLevelNumber(+user?.level.level);
    setIsEditing(false);
  };

  return (
    <Card className="flex flex-wrap items-center gap-x-6 gap-y-4 p-6">
      <Avatar className="size-[72px]">
        <AvatarImage
          src={user?.avatar || "/images/default-avatar.jpg"}
          alt="avatar"
        />
        <AvatarFallback className="bg-foreground text-2xl font-semibold text-background">
          {user?.codeforcesHandle?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-[1_1_200px]">
        <h1 className="truncate text-2xl font-semibold tracking-tight">
          {user?.codeforcesHandle}
        </h1>
        <p className="text-foreground-soft">
          Codeforces rating{" "}
          <span className="font-mono text-sm font-medium text-foreground">
            {user?.rating}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-muted py-2 pl-[18px] pr-1.5">
        {isEditing ? (
          <>
            <label
              htmlFor="level"
              className="text-[13px] text-muted-foreground"
            >
              Level
            </label>
            <Input
              id="level"
              className="w-20 font-mono"
              type="number"
              value={Number.isNaN(newLevelNumber) ? "" : newLevelNumber}
              onChange={(e) => setNewLevelNumber(parseInt(e.target.value))}
            />
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button variant="link" className="px-3" onClick={onCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <div>
              <div className="text-[13px] text-muted-foreground">Level</div>
              <div className="font-mono text-[22px] font-medium leading-tight tracking-tight">
                {user?.level.level}
              </div>
            </div>
            <Button
              variant="link"
              className="px-3"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </>
        )}
      </div>
      <Button onClick={logout} variant="outline">
        Log out
      </Button>
    </Card>
  );
};

export default Profile;
