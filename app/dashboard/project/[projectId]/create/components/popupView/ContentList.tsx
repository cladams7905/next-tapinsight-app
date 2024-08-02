"use client";

import { Tables } from "@/supabase/types";
import { Pencil, TrashIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { IColor } from "react-color-palette";

export default function ContentList({
  activeProject,
  setActiveProject,
  events,
  activeEvent,
  backgroundColor,
  textColor,
  accentColor,
  verifiedColor,
  borderColor,
  contentBody,
  setContentBody,
  activeContent,
  setActiveContent,
  variableList,
  replaceVariablesInContentBody,
}: {
  activeProject: Tables<"Projects">;
  setActiveProject: Dispatch<SetStateAction<Tables<"Projects">>>;
  events: Tables<"Events">[];
  activeEvent: Tables<"Events"> | undefined;
  backgroundColor: IColor;
  textColor: IColor;
  accentColor: IColor;
  verifiedColor: IColor;
  borderColor: IColor;
  contentBody: string[];
  setContentBody: Dispatch<SetStateAction<string[]>>;
  activeContent: string;
  setActiveContent: Dispatch<SetStateAction<string>>;
  variableList: string[];
  replaceVariablesInContentBody: (
    contentStr?: string | null,
    shouldReturnHTML?: boolean
  ) => string;
}) {
  const handleToggleActiveContent = (content: string) => {
    if (content !== activeContent) {
      setActiveContent(content);
    }
  };

  return (
    <div className="flex flex-col w-full mt-12 ml-20 h-fit max-h-56 gap-3 overflow-y-scroll overflow-x-visible py-2 cursor-pointer">
      {contentBody.map((entry, i) => (
        <div
          key={i}
          className="flex flex-row items-center justify-center gap-4"
        >
          <div
            onClick={() => handleToggleActiveContent(entry)}
            className={`inline-block w-full max-w-[35vw] h-fit bg-white/50 rounded-lg py-2 px-5 text-sm ${
              activeContent === entry
                ? "ring-2 ring-primary"
                : "border border-gray-200"
            }`}
            dangerouslySetInnerHTML={{
              __html: replaceVariablesInContentBody(entry, true),
            }}
          />
          <div className="flex flex-row items-center justify-center gap-2 right-[-2rem] top-1/2">
            <div className="rounded-lg p-1 cursor-pointer hover:bg-primary/20">
              <Pencil width={20} height={20} />
            </div>
            <div className="rounded-lg p-1 cursor-pointer hover:bg-primary/20">
              <TrashIcon width={20} height={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
