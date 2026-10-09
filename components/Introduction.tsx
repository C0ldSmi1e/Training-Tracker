import Link from "next/link";
import { Card } from "@/components/ui/card";

const linkClassName =
  "text-link underline underline-offset-2 hover:text-link/80";

const Introduction = () => {
  return (
    <Card className="p-6 text-foreground-soft">
      <p className="max-w-[72ch] text-foreground">
        Training Tracker is a practice tool for competitive programming,
        inspired by{" "}
        <Link
          href="https://codeforces.com/blog/entry/136704"
          target="_blank"
          className={linkClassName}
        >
          this blog post
        </Link>
        . Huge thanks to{" "}
        <Link
          href="https://codeforces.com/profile/pwned"
          target="_blank"
          className={linkClassName}
        >
          pwned
        </Link>{" "}
        for the idea.
      </p>
      <div className="mt-[22px] flex flex-wrap gap-x-12 gap-y-5">
        <div className="min-w-0 flex-[1_1_320px]">
          <h2 className="mb-2 font-semibold text-foreground">Usage</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Enter your Codeforces handle in{" "}
              <Link href="/" className={linkClassName}>
                Home
              </Link>{" "}
              page. This step is{" "}
              <span className="font-semibold text-foreground">required</span>,
              because the data are fetched from Codeforces API.
            </li>
            <li>
              Generate random problems in{" "}
              <Link href="/training" className={linkClassName}>
                Training
              </Link>{" "}
              page. You can also generate problems with tags.
            </li>
            <li>
              View your training history in{" "}
              <Link href="/statistics" className={linkClassName}>
                Statistics
              </Link>{" "}
              page.
            </li>
            <li>
              While you are training, if you click the{" "}
              <span className="font-semibold text-foreground">Finish</span>{" "}
              button, the record will be added to your training history.
              Otherwise, if you click the{" "}
              <span className="font-semibold text-foreground">Stop</span>{" "}
              button, the record will not be added to your training history.
            </li>
          </ol>
        </div>
        <div className="min-w-0 flex-[1_1_320px]">
          <h2 className="mb-2 font-semibold text-foreground">Note</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              The formula of getting user&apos;s level, ratings of generated
              problems and training performance are from{" "}
              <Link
                href="https://codeforces.com/blog/entry/136704"
                target="_blank"
                className={linkClassName}
              >
                this blog post
              </Link>
              .
            </li>
            <li>
              For now,{" "}
              <span className="font-semibold text-foreground">
                all the data (user info, training history, etc.) are stored in
                your browser&apos;s local storage
              </span>
              , so once you clear the data, you will lose all your training
              history.
            </li>
          </ol>
        </div>
      </div>
      <p className="mt-[22px] border-t pt-[18px]">
        This project is developed by{" "}
        <Link
          href="https://codeforces.com/profile/C0ldSmi1e"
          target="_blank"
          className={linkClassName}
        >
          C0ldSmi1e
        </Link>
        . You can find the source code{" "}
        <Link
          href="https://github.com/C0ldSmi1e/training-tracker"
          target="_blank"
          className={linkClassName}
        >
          here
        </Link>
        . Any suggestions, bug reports or feature requests are welcome.
      </p>
    </Card>
  );
};

export default Introduction;
