"use client";

import Profile from "@/components/Profile";
import Settings from "@/components/Settings";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Introduction from "@/components/Introduction";
import useUser from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  const { user, isLoading, error, logout } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Training Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              {user ? <Profile user={user} logout={logout} /> : <Settings />}
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