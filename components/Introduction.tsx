import Link from "next/link";

const Introduction = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <p className="w-full text-left">
        Training Tracker is a practice tool for competitive programming,
        inspired by{" "}
        <Link
          href="https://codeforces.com/blog/entry/136704"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          this blog post
        </Link>
        . Huge thanks to{" "}
        <Link
          href="https://codeforces.com/profile/pwned"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          pwned
        </Link>{" "}
        for the idea.
      </p>
      <p className="w-full text-left font-bold">Usage:</p>
      <p className="w-full text-left">
        1. Enter your Codeforces handle in{" "}
        <Link href="/" className="text-blue-500 hover:underline">
          Home
        </Link>{" "}
        page. This step is <span className="font-bold">required</span>, because
        the data are fetched from Codeforces API.
      </p>
      <p className="w-full text-left">
        2. Generate random problems in{" "}
        <Link href="/training" className="text-blue-500 hover:underline">
          Training
        </Link>{" "}
        page. You can also generate problems with tags.
      </p>
      <p className="w-full text-left">
        3. View your training history in{" "}
        <Link href="/statistics" className="text-blue-500 hover:underline">
          Statistics
        </Link>{" "}
        page.
      </p>
      <p className="w-full text-left">
        4. While you are training, if you click the{" "}
        <span className="font-bold">Finish</span> button, the record will be
        added to your training history. Otherwise, if you click the{" "}
        <span className="font-bold">Stop</span> button, the record will not be
        added to your training history.
      </p>
      <p className="w-full text-left font-bold">Note:</p>
      <p className="w-full text-left">
        1. The formula of getting user&apos;s level, ratings of generated
        problems and training performance are from{" "}
        <Link
          href="https://codeforces.com/blog/entry/136704"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          this blog post
        </Link>
        .
      </p>
      <p className="w-full text-left">
        2. For now,{" "}
        <span className="font-bold">
          all the data (user info, training history, etc.) are stored in your
          browser&apos;s local storage
        </span>
        , so once you clear the data, you will lose all your training history.
      </p>
      <p className="w-full text-left">
        This project is developed by{" "}
        <Link
          href="https://codeforces.com/profile/C0ldSmi1e"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          C0ldSmi1e
        </Link>
        . You can find the source code{" "}
        <Link
          href="https://github.com/C0ldSmi1e/training-tracker"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          here
        </Link>
        . Any suggestions, bug reports or feature requests are welcome.
      </p>
    </div>
  );
};

export default Introduction;
