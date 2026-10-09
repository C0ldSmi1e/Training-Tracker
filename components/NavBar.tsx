"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import ModeToggle from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/User";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/statistics", label: "Statistics" },
  { href: "/upsolve", label: "Upsolve" },
];

const NavBar = () => {
  const pathname = usePathname();
  // Read the user from the SWR cache that useUser fills (same key) instead of
  // calling useUser here, which would fire one more Codeforces request
  const { data: user } = useSWR<User | null>("codeforces-user");

  return (
    <header className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-3.5 sm:grid-cols-[1fr_auto_1fr]">
      <Link
        href="/"
        className="flex min-h-11 items-center gap-2.5 justify-self-start text-base font-semibold tracking-tight"
      >
        <span
          aria-hidden="true"
          className="size-[18px] rounded-full border-[5px] border-primary"
        />
        Training Tracker
      </Link>
      <nav
        aria-label="Main"
        className="order-last col-span-2 flex gap-1 sm:order-none sm:col-span-1"
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center rounded-full px-3.5 transition-colors sm:flex-none",
                isActive
                  ? "bg-card font-semibold text-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))]"
                  : "font-medium text-foreground-soft hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-2 justify-self-end">
        <ModeToggle />
        {user && (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-9">
              <AvatarImage src={user.avatar} alt="" />
              <AvatarFallback className="bg-foreground text-[13px] font-semibold text-background">
                {user.codeforcesHandle.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user.codeforcesHandle}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
