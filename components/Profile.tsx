"use client";

import { useState } from "react";

import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Response } from "@/types/Response";
import { LucideEdit } from "lucide-react";

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

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
      <Avatar className="w-24 h-24 md:w-40 md:h-40">
        <AvatarImage src={user?.avatar || "/default-avatar.jpg"} alt="avatar" />
        <AvatarFallback>
          {user?.codeforcesHandle?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center md:items-start justify-center gap-2">
        <div className="text-lg">
          <span className="font-bold">Username:</span> {user?.codeforcesHandle}
        </div>
        <div>
          <span className="font-bold">Rating:</span> {user?.rating}
        </div>
        <div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="font-bold">Level:</span>
              <Input
                className="w-20"
                type="number"
                value={newLevelNumber}
                onChange={(e) => setNewLevelNumber(parseInt(e.target.value))}
              />
              <Button onClick={onSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-bold">Level:</span> {user?.level.level}
              <LucideEdit
                className="w-4 h-4 cursor-pointer"
                onClick={() => setIsEditing(true)}
              />
            </div>
          )}
        </div>
        <Button onClick={logout} variant="outline" className="mt-2">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
