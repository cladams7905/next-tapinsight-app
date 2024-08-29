import React from "react";

export default async function AuthCodeError() {
  return (
    <main className="bg-gradient-to-tr from-purple-200 via-primary/60 to-purple-100">
      <div className="navbar fixed lg:px-20 font-sans">
        <div className="navbar-start">
          {/* <Logo/> */}
          <div className="ml-2 font-bold">Taplo</div>
        </div>
      </div>
      <div className="flex min-h-screen w-full flex-col items-center justify-between p-24 font-sans">
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          <p className="font-bold text-4xl mb-4">Authorization error.</p>
          <p>
            Please try logging in or registering again in a while. We apologize
            for the inconvenience.
          </p>
        </div>
      </div>
    </main>
  );
}
