import { useEffect } from "react";
import useSWR from "swr";
import { User } from "@/types/User";
import getUser from "@/utils/codeforces/getUser";
import { getLevel, getLevelByRating } from "@/utils/getLevel";
import { SuccessResponse, ErrorResponse } from "@/types/Response";

const USER_STORAGE_KEY = "training-tracker-user";
const USER_CACHE_KEY = "codeforces-user";

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const useUser = () => {
  const {
    data: user,
    isLoading,
    mutate,
    error,
  } = useSWR<User | null>(USER_CACHE_KEY, getStoredUser, {
    fallbackData: getStoredUser(),
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    const fetchLatestUser = async () => {
      if (!user?.codeforcesHandle) return;
      const res = await getUser(user.codeforcesHandle);
      if (!res.success) return;
      const profile = res.data;
      if (profile.rating !== user.rating || profile.avatar !== user.avatar) {
        const newUser = {
          codeforcesHandle: profile.handle as string,
          avatar: profile.avatar as string,
          rating: profile.rating as number,
          level: getLevelByRating(profile.rating),
        };
        await mutate(newUser, { revalidate: false });
      }
    };
    fetchLatestUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.codeforcesHandle]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const updateUser = async (codeforcesHandle: string) => {
    try {
      const res = await getUser(codeforcesHandle);
      if (!res.success) {
        throw new Error("Failed to fetch user");
      }

      const profile = res.data;
      const newUser = {
        codeforcesHandle: profile.handle as string,
        avatar: profile.avatar as string,
        rating: profile.rating as number,
        level: getLevelByRating(profile.rating),
      };

      await mutate(newUser, { revalidate: false });
      return SuccessResponse("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      return ErrorResponse("Failed to update user");
    }
  };

  const changeUserLevel = async (newLevelNumber: number) => {
    if (!user) {
      return ErrorResponse("User not found");
    }

    const originalLevel = user.level;
    const newLevel = getLevel(newLevelNumber);

    try {
      await mutate({ ...user, level: newLevel }, { revalidate: false });
      return SuccessResponse("User level updated successfully");
    } catch (error) {
      await mutate({ ...user, level: originalLevel }, { revalidate: false });
      console.error("Error updating user level:", error);
      return ErrorResponse("Failed to update user level");
    }
  };

  const updateUserLevel = async ({ delta }: { delta: number }) => {
    // update user level after training
    if (!user) {
      return ErrorResponse("User not found");
    }

    const newLevel = getLevel(+user.level.level + delta);

    if (!newLevel || +newLevel.level < 1 || +newLevel.level > 109) {
      return ErrorResponse("Failed to update user level");
    }

    try {
      await mutate({ ...user, level: newLevel }, { revalidate: false });
      return SuccessResponse("User level updated successfully");
    } catch (error) {
      console.error("Error updating user level:", error);
      return ErrorResponse("Failed to update user level");
    }
  };

  const logout = () => {
    mutate(null, { revalidate: false });
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return {
    user,
    isLoading,
    error,

    updateUser,
    updateUserLevel,
    changeUserLevel,
    logout,
  };
};

export default useUser;
