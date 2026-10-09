import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Error = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle className="size-6" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            An unexpected error occurred. Please try again later.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Error;
