"use client";

import Profile from "@/components/Profile";
import Settings from "@/components/Settings";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Introduction from "@/components/Introduction";
import useUser from "@/hooks/useUser";

const Home = () => {
  const { user, isLoading, error, logout, changeUserLevel } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col gap-4 pt-1">
      {user ? (
        <Profile
          user={user}
          logout={logout}
          changeUserLevel={changeUserLevel}
        />
      ) : (
        <Settings />
      )}
      <Introduction />
    </div>
  );
};

export default Home;
