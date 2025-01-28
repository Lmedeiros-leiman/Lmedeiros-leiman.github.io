import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { Fragment } from "preact/jsx-runtime";
import Title from "./Title";
import React, { type ReactElement } from "preact/compat";
import { _ } from "../context/LocaleContext";
import { BackspaceIcon } from "@heroicons/react/24/outline";
import { Carousel } from "react-responsive-carousel";
import ReactMarkDown from 'react-markdown'
import "react-responsive-carousel/lib/styles/carousel.min.css";



export type Project = {
  title: string;
  image: string[];
  liveAt: string;
  source: string | undefined;
  description: React.ReactNode | undefined;
  tags: string[];
  iconsShowcase?: string;
  status: string;
};

const ProjectItem: React.FC<{ project: Project }> = ({ project }) => {
  
  const StatusTags: Record<string, ReactElement> = {
    Finished: (
      <span className="bg-emerald-400 py-1 px-3 text-white font-bold rounded-full">
        {_("Finished")}
      </span>
    ),
    "Small Tweaks": (
      <span className="bg-cyan-400 py-1 px-3 text-white font-bold rounded-full">
        {_("Small Tweaks")}
      </span>
    ),
    Building: (
      <span className="bg-blue-400 py-1 px-3 text-white font-bold rounded-full">
        { _("Building") }
      </span>
    ),
    Planning: (
      <span className="bg-gray-600 py-1 px-3 text-white font-bold rounded-full">
        {_("Planning")}
      </span>
    ),
  };
  
  
  return (
    <Popover className="relative">
      <PopoverButton className="focus-within:outline-none " >
        <div className="p-2  rounded-lg  transform transition hover:scale-105  shadow-lg shadow-black/30">
          <picture className="">
            <img
              className="rounded-lg border border-black/75 object-cover"
              src={` /assets/images/${project.image[0]}`}
              alt="Foto do projeto"
              width="280px"
              height="380px"
            />
          </picture>
          <h1 className="font-bold text-3xl text-start dark:text-gray-200 text-gray-800 my-1">
            {project.title}
          </h1>
        </div>
      </PopoverButton>

      <PopoverBackdrop className="fixed inset-0 top-0 left-0 z-50 bg-black/80" />

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="fixed top-0 left-0 flex flex-grow w-full h-full justify-center items-center z-50">
          <section className="bg-white border-2 shadow-lg dark:border-gray-800 dark:bg-black rounded-lg w-full h-full max-h-[640px] overflow-auto sm:h-min sm:w-[640px]  ">
            <header className="bg-slate-200 dark:bg-slate-800  shadow flex top-0 left-0 z-50 w-full sticky items-center px-3 py-1 m-0">
              <PopoverButton className=" flex items-center justify-center me-4 w-12 h-12 text-rose-600 rounded-full">
                <BackspaceIcon height={40} />
              </PopoverButton>
              <h1 className="text-2xl border-s border-s-black ps-1 pe-5">
                {project.title}
              </h1>
              {StatusTags[project.status]}
            </header>

            <Carousel
              showStatus={false}
              showIndicators={false}
              showThumbs={project.image.length > 1}
              showArrows={project.image.length > 1}
              className=""
            >
              {project.image.map((imageName) => {
                return (
                  <picture className=" h-[320px] ">
                    <source
                      srcset={`/assets/images/${imageName}`}
                      src={`/assets/images/${imageName}`}
                    />
                    <img
                      className={"object-fill"}
                      width={640}
                      height={320}
                      src={`/assets/images/${imageName}`}
                    />
                  </picture>
                );
              })}
            </Carousel>
            <article className={"px-5 markdown"}>
              <ReactMarkDown>
                {project.description as string}
              </ReactMarkDown>
              
              
            </article>
          </section>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export const MyProjectsList = () => {
  const Projects: Project[] = [
    {
      title: _("YoutubeProjectTitle"),
      image: ["youtubeMain.png", "youtubeMain.png", "youtubeMain.png"],
      liveAt: "/youtube-clone/",
      source:
        "https://github.com/Lmedeiros-leiman/Lmedeiros-leiman.github.io/tree/master/src/pages/youtube-clone",
      description: _("YoutubeProjectDescription"),
      tags: [],

      status: "Building",
    },
  ];

  return (
    <>
      <div>
        <Title>{_("ProjectsTitle")}</Title>
        <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-6 p-4 pb-12">
          {Projects.map((project, index) => {
            return (
              <>
                <ProjectItem key={index} project={project} />
              </>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default MyProjectsList;
