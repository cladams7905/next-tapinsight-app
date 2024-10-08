"use client";

import React from "react";
import { useState } from "react";
import LoadingDots from "@/app/_components/shared/loadingdots";
import Google from "@/app/_components/shared/icons/google";
import { createClient } from "@/lib/supabase/client";
import { getURL } from "@/lib/actions";

export default function OAuthForm() {
  const [signInClicked, setSignInClicked] = useState(false);

  const supabase = createClient();

  const logInWithGoogle = async () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: getURL() + "/callback",
      },
    });
  };

  return (
    <>
      <div className="flex flex-col space-y-4 w-full font-sans">
        <div className="flex flex-row  justify-center items-center w-full my-2">
          <hr className="w-full" />
          <p className="text-sm px-4 min-w-fit">Or continue with</p>
          <hr className="w-full" />
        </div>
        <button
          disabled={signInClicked}
          className={`btn
			${signInClicked ? "cursor-not-allowed btn-disabled" : "btn-accent text-white"}`}
          onClick={() => {
            setSignInClicked(true);
            logInWithGoogle();
          }}
        >
          {signInClicked ? (
            <LoadingDots color="oklch(var(--a))" />
          ) : (
            <>
              <Google className="h-5 w-5" />
              <p>Google</p>
            </>
          )}
        </button>
      </div>
    </>
  );
}
