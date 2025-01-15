import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { Fragment } from "preact/jsx-runtime";
import Title from "./Title";



const Projects = [
    {
        title: "Clone do youtube",
        source: "",
        url: "/youtube-clone/",
        image: "https://via.placeholder.com/280",
    },
];


export const MyProjectsList = () => {


    return (<>
        <div>
            <Title>
                Projetos & Experiencias
            </Title>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-6 p-4">
                {Projects.map((project, index) => {
                    return (
                        <Popover key={index} className="relative">
                            <PopoverButton>
                                <div className="p-1 w-72 border dark:border-emerald-800 border-gray-50 rounded-lg shadow-md transform transition hover:scale-105 hover:shadow-lg">
                                    <picture>
                                        <img
                                            className="rounded-lg border border-black/75 object-cover"
                                            src={project.image}
                                            alt="Foto do projeto"
                                            width="280px"
                                            height="380px"
                                        />
                                    </picture>
                                    <h1 className="font-bold text-3xl text-center dark:text-gray-200 text-gray-800 my-1">
                                        Clone do youtube
                                    </h1>
                                </div>
                            </PopoverButton>

                            <PopoverBackdrop className="fixed inset-0 bg-black/80" />

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <PopoverPanel className="fixed top-1/4 left-1/4 md:left-1/3">
                                    <section className="bg-white">
                                        <div className="max-w-3xl w-full p-5">
                                            <PopoverButton>
                                                <span className="text-xl text-red-700 bg-red-200 rounded-full select-none p-0 px-2">
                                                    X
                                                </span>
                                                <span className="text-black"> Project Title </span>
                                            </PopoverButton>

                                            <div className="grid grid-cols-2 gap-4">
                                                <aside>
                                                    <picture>
                                                        <source
                                                            srcSet={project.image}
                                                            type="image/jpeg"
                                                        ></source>
                                                        <img src={project.image} alt="Foto do projeto" />
                                                    </picture>
                                                </aside>

                                                <article>b</article>
                                            </div>
                                        </div>
                                    </section>
                                </PopoverPanel>
                            </Transition>
                        </Popover>
                    );
                })}
            </ul>
        </div>

    </>)
}

export default MyProjectsList