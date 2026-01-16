"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { User, LogIn, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Profile() {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleSettings = () => {
    console.log("Settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80">
          {status === "authenticated" && session?.user?.image ? (
            <Image
              unoptimized={true}
              src={session.user.image}
              alt={session.user.name || "Profile"}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === "authenticated" ? (
     <>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
           <DropdownMenuItem onClick={handleSettings}>
           <Settings className="mr-2 h-4 w-4" />
           <span>Settings</span>
         </DropdownMenuItem></>
        ) : (
          <DropdownMenuItem onClick={handleSignIn}>
            <LogIn className="mr-2 h-4 w-4" />
            <span>Sign In</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

