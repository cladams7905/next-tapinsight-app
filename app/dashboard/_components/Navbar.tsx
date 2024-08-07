"use client";

import UserDropdown from "./UserDropdown";
import { User } from "@supabase/supabase-js";
import { ChevronRight, Menu } from "lucide-react";
import Tablist from "./NavbarTablist";
import ProjectDropdown from "./ProjectDropdown";
import { Tables } from "@/supabase/types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar({
  user,
  projects,
  fetchedActiveProject,
}: {
  user: User;
  projects: Tables<"Projects">[];
  fetchedActiveProject: Tables<"Projects">;
}) {
  const pathname = usePathname();
  const [isHiddenTabList, setIsHiddenTabList] = useState(false);
  const [activeProject, setActiveProject] = useState<
    Tables<"Projects"> | undefined
  >(fetchedActiveProject);
  const [reorderedProjects, setReorderedProjects] =
    useState<Tables<"Projects">[]>(projects);

  // First useEffect to set the active project
  useEffect(() => {
    setActiveProject(fetchedActiveProject);
  }, [fetchedActiveProject]);

  // Second useEffect to reorder projects when active project changes
  useEffect(() => {
    if (activeProject) {
      const updatedProjects = moveToTop(
        projects,
        projects.find((project) => project.id === activeProject.id)
      );
      setReorderedProjects(updatedProjects);
    }
  }, [activeProject, projects]);

  // Helper function to move active project to the top
  const moveToTop = (
    projects: Tables<"Projects">[],
    activeProject: Tables<"Projects"> | undefined
  ) => {
    if (!activeProject) return projects;
    return [
      activeProject,
      ...projects.filter((project) => project.id !== activeProject.id),
    ];
  };

  useEffect(() => {
    /* This check is used for toggling the navbar tablist. 
    On the create project page, the tablist should not show. */
    if (typeof window !== "undefined") {
      setIsHiddenTabList(pathname === "/dashboard/create-project");
    }
  }, [pathname]);

  return (
    <main className="flex flex-col items-center w-full font-sans z-30 px-3 transition-all border-b border-gray-300 dark:bg-base-100 shadow-md bg-white">
      <div className="navbar flex">
        <div className="navbar-start">
          <label
            role="button"
            className="flex ml-2 mr-6 lg:hidden drawer-button"
            htmlFor="sidebar-drawer"
          >
            <Menu color="oklch(var(--bc))" />
          </label>
          <div className="font-bold">TapInsight</div>
          <div className="text-gray-500 text-xl ml-6 font-thin">
            <ChevronRight
              height={16}
              width={16}
              strokeWidth={2}
              color="oklch(var(--bc))"
            />
          </div>
          <ProjectDropdown
            projects={reorderedProjects}
            activeProject={activeProject}
            setActiveProjectRef={setActiveProject}
          />
        </div>
        {!isHiddenTabList && (
          <div className="navbar-center hidden lg:block lg:mt-[2px]">
            <Tablist activeProject={activeProject} />
          </div>
        )}
        <div className="navbar-end">
          <UserDropdown user={user} />
        </div>
      </div>
    </main>
  );
}
