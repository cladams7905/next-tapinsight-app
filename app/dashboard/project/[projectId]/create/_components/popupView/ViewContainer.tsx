"use client";

import { Tables } from "@/supabase/types";
import { IColor } from "react-color-palette";
import { Dispatch, SetStateAction, useTransition } from "react";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import PopupViewer from "./PopupViewer";
import ViewContainerHeader from "./ViewContainerHeader";

export default function ViewContainer({
  activeProject,
  setActiveProject,
  events,
  setEvents,
  activeEvent,
  setActiveEvent,
  backgroundColor,
  textColor,
  accentColor,
  borderColor,
  isInPreview,
  setIsInPreview,
  displayTime,
}: {
  activeProject: Tables<"Projects">;
  setActiveProject: Dispatch<SetStateAction<Tables<"Projects">>>;
  events: Tables<"Events">[];
  setEvents: Dispatch<SetStateAction<Tables<"Events">[]>>;
  activeEvent: Tables<"Events"> | undefined;
  setActiveEvent: Dispatch<SetStateAction<Tables<"Events"> | undefined>>;
  backgroundColor: IColor;
  textColor: IColor;
  accentColor: IColor;
  borderColor: IColor;
  isInPreview: boolean;
  setIsInPreview: Dispatch<SetStateAction<boolean>>;
  displayTime: number;
}) {
  const [isLoadPending, startLoadTransition] = useTransition();

  return (
    <div className="relative flex flex-col !rounded-none bg-gradient-to-tr from-primary/50 to-purple-100 h-full z-[1] py-2 px-5">
      <ViewContainerHeader
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        events={events}
        backgroundColor={backgroundColor}
        accentColor={accentColor}
        textColor={textColor}
        borderColor={borderColor}
        isInPreview={isInPreview}
        setIsInPreview={setIsInPreview}
        displayTime={displayTime}
        isLoadPending={isLoadPending}
      />
      <div className="flex justify-center items-center w-full h-full">
        {events.length > 0 && (
          <PopupViewer
            activeProject={activeProject}
            setActiveProject={setActiveProject}
            events={events}
            activeEvent={activeEvent}
            setActiveEvent={setActiveEvent}
            backgroundColor={backgroundColor}
            accentColor={accentColor}
            textColor={textColor}
            borderColor={borderColor}
            startLoadTransition={startLoadTransition}
          />
        )}
      </div>
      <div className="flex absolute bottom-0 right-0 w-full justify-end items-end px-5 pb-3">
        <div
          className="tooltip tooltip-top tooltip-info p-2 rounded-lg cursor-pointer hover:bg-primary/20"
          data-tip="Help"
        >
          <QuestionMarkCircledIcon width={20} height={20} />
        </div>
      </div>
    </div>
  );
}
