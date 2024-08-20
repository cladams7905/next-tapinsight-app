"use client";

import { Tables } from "@/supabase/types";
import Sidebar from "./Sidebar";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IColor, useColor } from "react-color-palette";
import ViewContainer from "./popupView/ViewContainer";
import { sortByTimeCreated } from "@/lib/actions";
import { ContentVars } from "@/lib/enums";

interface ProjectContextType {
  activeProject: Tables<"Projects">;
  setActiveProject: Dispatch<SetStateAction<Tables<"Projects">>>;
  activeEvent: Tables<"Events"> | undefined;
  setActiveEvent: Dispatch<SetStateAction<Tables<"Events"> | undefined>>;
  events: Tables<"Events">[];
  setEvents: Dispatch<SetStateAction<Tables<"Events">[]>>;
  integrations: Tables<"Integrations">[];
  setIntegrations: Dispatch<SetStateAction<Tables<"Integrations">[]>>;
  backgroundColor: IColor;
  setBackgroundColor: Dispatch<SetStateAction<IColor>>;
  textColor: IColor;
  setTextColor: Dispatch<SetStateAction<IColor>>;
  accentColor: IColor;
  setAccentColor: Dispatch<SetStateAction<IColor>>;
  borderColor: IColor;
  setBorderColor: Dispatch<SetStateAction<IColor>>;
  displayTime: number;
  setDisplayTime: Dispatch<SetStateAction<number>>;
  replaceVariablesInContentBody: (
    contentStr?: string | null,
    shouldReturnHTML?: boolean,
    isPopupText?: boolean
  ) => string;
}

/**
 * Project context and custom hook to access context
 */
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

/**
 * @interface ProjectContextType
 * @prop activeProject
 * @prop activeEvent
 * @prop events
 * @prop integrations
 * @prop backgroundColor
 * @prop textColor
 * @prop borderColor
 * @prop accentColor
 * @prop isPreviewMode
 * @prop displayTime
 * @prop replaceVarsInContentBody
 * @returns the project context
 */
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};

export default function ProjectBoard({
  fetchedActiveProject,
  fetchedIntegrations,
  fetchedEvents,
}: {
  fetchedActiveProject: Tables<"Projects">;
  fetchedIntegrations: Tables<"Integrations">[];
  fetchedEvents: Tables<"Events">[];
}) {
  /**
   * Active Project: the project which is currently being displayed from
   * the project dropdown menu.
   */
  const [activeProject, setActiveProject] =
    useState<Tables<"Projects">>(fetchedActiveProject);

  /**
   * Events: the state value that stores all the events associated with a project.
   */
  const [events, setEvents] = useState<Tables<"Events">[]>(
    sortByTimeCreated(fetchedEvents)
  );

  /**
   * Active event: the current event that is displayed in the popup view window.
   */
  const [activeEvent, setActiveEvent] = useState<Tables<"Events"> | undefined>(
    events[0] || undefined
  );

  /**
   * Integrations: the state value that stores all integrations associated with
   * a project.
   */
  const [integrations, setIntegrations] =
    useState<Tables<"Integrations">[]>(fetchedIntegrations);

  /**
   * Display time: the time allotted for each popup to display to a user.
   */
  const [displayTime, setDisplayTime] = useState<number>(
    fetchedActiveProject.display_time ? fetchedActiveProject.display_time : 5000
  );

  /**
   * isPreviewMode: handles toggling the state between the popup preview window.
   */
  const [isPreviewMode, setPreviewMode] = useState(false);

  /**
   * Popup styling state variables
   */
  const [backgroundColor, setBackgroundColor] = useColor(
    activeProject?.bg_color ? activeProject.bg_color : "#FFFFFF"
  );
  const [textColor, setTextColor] = useColor(
    activeProject?.text_color ? activeProject.text_color : "#172554"
  );
  const [accentColor, setAccentColor] = useColor(
    activeProject?.accent_color ? activeProject.accent_color : "#6b7280"
  );
  const [borderColor, setBorderColor] = useColor(
    activeProject?.border_color ? activeProject.border_color : "#D1D3D7"
  );

  /**
   * When the active event changes, this callback/useEffect makes sure that
   * anything changed in the active event is set within the corresponding event in
   * the events array.
   */
  const updateEvents = useCallback(
    (newEvent: Tables<"Events">) => {
      setEvents((prevEvents) =>
        prevEvents.map((prev) =>
          prev.id === newEvent.id ? { ...prev, ...newEvent } : prev
        )
      );
    },
    [setEvents]
  );

  useEffect(() => {
    if (activeEvent) {
      updateEvents(activeEvent);
    }
  }, [activeEvent, updateEvents]);

  /**
   * Searches for variables inside of the text content body and replaces them with
   * example data inside of the popup viewer.
   * @param contentStr the content body text
   * @param shouldReturnHTML whether the variables should be replaced with HTML span elements
   * @param isPopupText whether the content is appearing in the popup template or in the sidebar
   * @returns the revised content body (should be set inside of dangerouslySetHTML if
   * shouldReturnHTML is set to true)
   */
  const replaceVariablesInContentBody = (
    contentStr?: string | null,
    shouldReturnHTML?: boolean,
    isPopupText?: boolean
  ) => {
    if (!contentStr) return "";

    const getVariableHTML = (
      word: string,
      index: number,
      isPopupText = false
    ) => {
      return `<span key=${index} class="text-primary px-1 rounded-lg">${
        "[" +
        replaceVariable(
          word.substring(1).toLocaleLowerCase() as ContentVars,
          isPopupText
        ) +
        "]"
      }</span>`;
    };

    const replaceVariable = (variable: ContentVars, isPopupText = false) => {
      let returnWord = "";
      switch (variable) {
        case ContentVars.Person:
          returnWord = isPopupText ? "Jamie" : "Person";
          break;
        case ContentVars.Location:
          returnWord = isPopupText
            ? "Seattle, Washington, USA"
            : "City, Country";
          break;
        case ContentVars.Product:
          returnWord = isPopupText
            ? `<span style="color: ${accentColor.hex.toString()};" class="font-bold rounded-lg underline">Airpods Pro</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="13" 
                  height="13" 
                  viewBox="0 0 24 24" 
                  fill="${backgroundColor.hex.toString()}" 
                  stroke="${accentColor.hex.toString()}" 
                  stroke-width="3" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  class="inline-flex mr-[2px] mb-[2px]"
                >
                  <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>
                  <path d="M21 3l-9 9"/>
                  <path d="M15 3h6v6"/>
                </svg>`
            : "My Product";
          break;
        default:
          returnWord = "undefined";
      }
      return returnWord;
    };

    const checkForInvalidCharsRegex = /[^a-zA-Z0-9\\]/;
    const filterInvalidCharsRegex = /(\\\w+|\w+|[^\w\s])/g;

    const transformedWords = contentStr.split(" ").map((word, i) => {
      if (word.startsWith("\\") && checkForInvalidCharsRegex.test(word)) {
        const cleanedWord = word.split(filterInvalidCharsRegex).filter(Boolean);
        return cleanedWord
          .map((val) => {
            return val.startsWith("\\")
              ? shouldReturnHTML
                ? getVariableHTML(val, i)
                : replaceVariable(
                    val.substring(1).toLocaleLowerCase() as ContentVars,
                    isPopupText
                  )
              : val;
          })
          .join("");
      } else {
        return word.startsWith("\\")
          ? shouldReturnHTML
            ? getVariableHTML(word, i)
            : replaceVariable(
                word.substring(1).toLocaleLowerCase() as ContentVars,
                isPopupText
              )
          : word;
      }
    });
    return transformedWords.join(" ");
  };

  const contextValue: ProjectContextType = {
    activeProject,
    setActiveProject,
    activeEvent,
    setActiveEvent,
    events,
    setEvents,
    integrations,
    setIntegrations,
    displayTime,
    setDisplayTime,
    backgroundColor,
    setBackgroundColor,
    textColor,
    setTextColor,
    accentColor,
    setAccentColor,
    borderColor,
    setBorderColor,
    replaceVariablesInContentBody,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      <main className="flex lg:flex-row md:flex-row flex-col w-full h-screen-minus-navbar">
        <div className="lg:w-[60%] w-full">
          <ViewContainer setPreviewMode={setPreviewMode} />
        </div>
        <div className="relative lg:w-[40%] w-full">
          <Sidebar isPreviewMode={isPreviewMode} />
        </div>
      </main>
    </ProjectContext.Provider>
  );
}
