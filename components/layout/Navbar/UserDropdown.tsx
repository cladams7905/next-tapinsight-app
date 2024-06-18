"use client";

import { CircleUser, LogOut, Settings } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/auth/actions";
import Image from "next/image";
import { useTransition } from "react";
import { redirect } from "next/navigation";
import LoadingDots from "@/components/shared/loadingdots";
import { showToastError } from "@/components/shared/showToast";
import Link from "next/link";

export default function UserDropdown(data: { user: User }) {
  const [isPending, startTransition] = useTransition();

  const email = data.user?.email;
  const username = email?.substring(0, email.indexOf("@"));
  const { avatar_url, name } = data?.user?.user_metadata || {};

  if (!email) return null;

  async function handleSignOut() {
    startTransition(async () => {
      const { error } = JSON.parse(await signOut());
      if (error) {
        showToastError(error);
      } else {
        redirect("/");
      }
    });
  }

  return (
    <div className="dropdown dropdown-end z-50 relative inline-block text-left">
      <button className="flex items-center justify-center overflow-hidden rounded-full">
        <div className="transition-all duration-75 active:scale-95">
          {avatar_url ? (
            <Image
              src={avatar_url}
              alt="user"
              width="36"
              height="36"
              className="mr-2 rounded-full border-2 border-neutral"
            ></Image>
          ) : (
            <CircleUser
              height={26}
              width={26}
              strokeWidth={1.25}
              className="mr-2 rounded-full"
            />
          )}
        </div>
      </button>
      <div className="dropdown-content w-fit min-w-48 mt-2 rounded-md bg-white p-2 border shadow border-neutral">
        <div className="p-2">
          {data?.user && (
            <>
              <p className="truncate text-sm font-medium text-gray-900">
                {name ? name : username}
              </p>
              <p className="truncate text-sm text-gray-400">{email}</p>
            </>
          )}
        </div>
        <Link href={"/account"}>
          <button className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100">
            <Settings className="h-auto w-4" />
            <p className="text-sm">Account</p>
          </button>
        </Link>
        <button
          className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
          onClick={() => handleSignOut()}
        >
          <LogOut className="h-auto w-4" />
          <p className="text-sm">
            {isPending ? (
              <LoadingDots color="oklch(var(--pc))" size="sm" />
            ) : (
              "Logout"
            )}
          </p>
        </button>
      </div>
    </div>
  );
}
