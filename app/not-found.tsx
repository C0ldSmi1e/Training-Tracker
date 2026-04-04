import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mt-10">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-3xl font-bold">
            <FileQuestion className="w-12 h-12 mr-2 text-primary" />
            Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
