"use client";

import { useClerk, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavbarClient() {
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/home");
  };

  return (
    <div className="flex-none flex items-center space-x-4">
      {isSignedIn ? (
        <>
          {user && (
            <>
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img
                    src={user.imageUrl}
                    alt={user.username || user.emailAddresses[0].emailAddress}
                  />
                </div>
              </div>
              <span className="text-sm truncate text-slate-200 max-w-xs lg:max-w-md">
                {user.username || user.emailAddresses[0].emailAddress}
              </span>
            </>
          )}
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
          >
            <LogOutIcon className="h-5 w-5 inline-block mr-1" />
            Logout
          </button>
        </>
      ) : (
        <>
          <SignInButton>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition">
              Sign Up
            </button>
          </SignUpButton>
        </>
      )}
    </div>
  );
}
