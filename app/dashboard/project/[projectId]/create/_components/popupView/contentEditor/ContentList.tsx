"use client";

import { CirclePlus, Pencil, TrashIcon } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
  useRef,
} from "react";
import AddEditContentModal from "./AddEditContentModal";
import { Tables } from "@/supabase/types";
import { updateEvent } from "@/lib/actions/events";
import { showToastError } from "@/components/shared/showToast";

export default function ContentList({
  activeEvent,
  setActiveEvent,
  contentBody,
  activeContent,
  setActiveContent,
  startLoadTransition,
  variableList,
  replaceVariablesInContentBody,
}: {
  activeEvent: Tables<"Events"> | undefined;
  setActiveEvent: Dispatch<SetStateAction<Tables<"Events"> | undefined>>;
  contentBody: string[];
  activeContent: string;
  setActiveContent: Dispatch<SetStateAction<string>>;
  startLoadTransition: TransitionStartFunction;
  variableList: string[];
  replaceVariablesInContentBody: (
    contentStr?: string | null,
    shouldReturnHTML?: boolean
  ) => string;
}) {
  const addEditContentModalRef = useRef<HTMLDialogElement>(null);

  const handleToggleActiveContent = (content: string) => {
    if (content !== activeContent) {
      setActiveContent(content);
    }
  };

  const handleDeleteContent = (content: string) => {
    startLoadTransition(async () => {
      if (activeEvent) {
        if (contentBody.length > 1) {
          const updatedContentBody = contentBody.filter(
            (val) => val !== content
          );
          const { data, error } = await updateEvent(activeEvent.id, {
            content_body: updatedContentBody,
          });
          if (error) {
            showToastError(error);
          } else {
            setActiveEvent((prevEvent) =>
              prevEvent
                ? {
                    ...prevEvent,
                    content_body: updatedContentBody,
                  }
                : prevEvent
            );
          }
        } else {
          showToastError(
            null,
            "Each event must have at least one content entry."
          );
        }
      }
    });
  };

  return (
    <div className="flex flex-col w-full mt-4 ml-[4.7rem] pl-1 h-fit lg:max-h-64 gap-3 overflow-y-scroll overflow-x-visible py-2 cursor-pointer">
      {contentBody.map((entry, i) => (
        <div
          key={i}
          className="flex flex-row items-center justify-center gap-4"
        >
          <div
            onClick={() => handleToggleActiveContent(entry)}
            className={`inline-block w-full max-w-[35vw] h-fit bg-white/50 rounded-lg py-2 px-5 text-sm ${
              activeContent === entry
                ? "ring-[3px] ring-primary"
                : "border border-gray-300 hover:ring-[3px] ring-primary/35"
            }`}
            dangerouslySetInnerHTML={{
              __html: replaceVariablesInContentBody(entry, true),
            }}
          />
          <div className="flex flex-row items-center gap-2 right-[-2rem] w-16 top-1/2">
            {activeContent === entry && (
              <>
                {" "}
                <div
                  className="rounded-lg p-1 cursor-pointer hover:bg-primary/20"
                  onClick={() => addEditContentModalRef.current?.showModal()}
                >
                  <Pencil width={16} height={16} />
                </div>
                <div
                  className="rounded-lg p-1 cursor-pointer hover:bg-primary/20"
                  onClick={() => handleDeleteContent(entry)}
                >
                  <TrashIcon width={16} height={16} />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center mt-1 mr-[70px]">
        <div
          className="btn btn-sm lg:mt-0 mt-8 lg:w-auto w-full btn-ghost text-xs"
          onClick={() => {
            addEditContentModalRef.current?.showModal();
          }}
        >
          <CirclePlus height={16} width={16} />
          Add Content
        </div>
      </div>
      <AddEditContentModal
        contentBody={contentBody}
        activeEvent={activeEvent}
        setActiveEvent={setActiveEvent}
        modalRef={addEditContentModalRef}
        variableList={variableList}
        activeContent={activeContent}
        startLoadTransition={startLoadTransition}
      />
    </div>
  );
}
