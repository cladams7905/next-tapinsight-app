"use client";

import { Tables } from "@/lib/supabase/types";
import ActiveToastView from "./ActiveToastView";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { ToastType } from "@/lib/enums";

export default function ToastBoard({
  userToasts,
  project,
}: {
  userToasts: Tables<"UserToasts">[];
  project: Tables<"Projects">;
}) {
  const [activeToast, setActiveToast] = useState<
    Tables<"UserToasts"> | undefined
  >(userToasts.length > 0 ? userToasts[0] : undefined);

  const [currentToasts, setCurrentToasts] =
    useState<Tables<"UserToasts">[]>(userToasts);
  const [toastType, setToastType] = useState<ToastType | undefined>();

  return (
    <main className="flex lg:columns-2 lg:join w-full h-screen-minus-navbar">
      <div className="lg:w-1/4">
        <Sidebar
          userToasts={currentToasts}
          project={project}
          activeToast={activeToast}
          setActiveToast={setActiveToast}
          setCurrentToasts={setCurrentToasts}
          toastType={toastType}
          setToastType={setToastType}
        />
      </div>
      <div className="lg:w-3/4 w-full">
        <ActiveToastView
          activeToast={activeToast}
          setActiveToast={setActiveToast}
          setCurrentToasts={setCurrentToasts}
        />
      </div>
    </main>
  );
}