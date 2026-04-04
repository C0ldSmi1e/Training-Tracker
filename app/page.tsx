"use client";

import Profile from "@/components/Profile";
import Settings from "@/components/Settings";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Introduction from "@/components/Introduction";
import useUser from "@/hooks/useUser";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  const { user, isLoading, error, logout, changeUserLevel } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6 space-y-6">
          <Card>
            <CardContent className="pt-6">
              {user ? (
                <Profile
                  user={user}
                  logout={logout}
                  changeUserLevel={changeUserLevel}
                />
              ) : (
                <Settings />
              )}
            </CardContent>
          </Card>
          <Separator className="my-4" />
          <Card>
            <CardContent className="pt-6">
              <Introduction />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
