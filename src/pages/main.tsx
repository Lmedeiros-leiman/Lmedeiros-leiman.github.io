import { render } from 'preact'
import '../index.css'
import fotoPessoal from "../assets/MinhaFotoFundo.jpeg"
import { FaBootstrap, FaReact, FaDocker, FaGitAlt, FaLaravel, FaPython } from 'react-icons/fa6'
import { Popover, PopoverButton } from "@headlessui/react";
import Preact from "../assets/preact.svg"
import React, { useEffect, useState } from 'preact/compat'
import { RiTailwindCssFill } from 'react-icons/ri'
import { SiRefinedgithub, SiTypescript, SiVite } from 'react-icons/si';

const SkillIcon: React.FC<{ children: React.ReactNode, title?: string, square?: boolean }> = ({ children, title = "", square = false }) => {


    return (<div
        className={
            "relative flex justify-center items-end transition duration-300 ease-in-out transform w-16 h-16 hover:-translate-y-1 hover:scale-105 p-0.5 bg-slate-100 shadow-lg " +
            (!square ? "rounded-full" : "rounded-lg")
        }
    >
        <Tooltip content={title}>{children}</Tooltip>
    </div>)
}

const Tooltip: React.FC<{ children: React.ReactNode, content: React.ReactNode }> = ({ children, content }) => {

    const [isVisible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;
        if (hovered) {
            timeout = setTimeout(() => {
                setVisible(true);
            }, 500);
        } else {
            clearTimeout(timeout);
            setVisible(false);
        }
        return () => clearTimeout(timeout);
    }, [hovered]);

    return (
        <Popover className="overflow-visible"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            onClick={() => setHovered(true)}
        >
            <PopoverButton className="focus:outline-none">{children}</PopoverButton>
            {isVisible && <div
                className="absolute bg-black px-1.5 py-0.5 rounded-lg text-white text-sm"
                style={{ whiteSpace: "nowrap" }}
            >
                {content}
            </div>}
        </Popover>
    );
};

type Skill = {
    title: string,
    icon: React.ReactNode,
    square?: boolean,
    color?: string
}

const Skills: Skill[] = [
    {
        title: "React",
        icon: <FaReact size={48} color="#61DAFB" />,

    },
    {
        title: "Laravel",
        icon: <FaLaravel size={48} color="#FF2D20" />,
        square: true,

    },
    {
        title: "Python",
        icon: <FaPython size={48} color="#3776AB" />,

    },
    {
        title: "Tailwind",
        icon: <RiTailwindCssFill size={48} color="#06B6D4" />,

    },
    {
        title: "Bootstrap",
        icon: <FaBootstrap size={48} color="#7952B3" />,

    },
    {
        title: "Docker",
        icon: <FaDocker size={48} color="#2496ED" />,

    },
    {
        title: "Git",
        icon: <FaGitAlt size={48} color="#F05032" />,

    },
    {
        title: "Github",
        icon: <SiRefinedgithub size={48} color="#9E95B7" />,
    },
    {
        title: "Typescript",
        square: true,
        icon: <SiTypescript size={48} color="#3178C6" />,

    }
];

type Project = {}

const Projects = [
    {},
]


render(<section className="w-full h-screen min-h-screen ">
    <header className="flex bg-black mb-24 justify-between items-center w-full px-4 py-2">
        <nav>

        </nav >
        <aside className="bg-black text-white font-bold px-6  py-2 rounded-lg">
            <span className="select-none hover:cursor-pointer transition-all hover:bg-slate-900 hover:ring-2 rounded-lg ring:ring-white p-1 px-4">🇧🇷 Pt-BR</span>
        </aside>
    </header >

    <div className="container mx-auto px-4 flex  flex-col md:flex-row items-center gap-8">

        <section className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                Leonardo Medeiros Leiman
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 font-medium">
                Desenvolvedor Full-Stack
            </p>
        </section>


        <div className="flex-1 flex justify-center">
            <picture className="relative p-1 bg-slate-600 rounded-lg shadow-lg">
                <img
                    className="rounded-lg max-w-full h-auto"
                    src={fotoPessoal}
                    alt="Foto Pessoal"
                    width="400"
                    height="400"
                />
            </picture>
        </div>
    </div>

    <div className="flex relative w-full flex-wrap justify-center py-16  pd:my-24 bg-transparent">
        <h2 className="w-full text-center text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-8">
            Ferramentas que utilizo
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 rounded-lg bg-slate-200 shadow-lg overflow-visible">
            {Skills.map((skill, index) => (
                <SkillIcon
                    key={index}
                    square={skill.square}
                    title={skill.title}
                >
                    {skill.icon}
                </SkillIcon>
            ))}
        </ul>
    </div>

    <div>
        <h2 className="w-full text-center text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-8">
            Projetos & Experiencias
        </h2>
        <ul>
            
        </ul>
    </div>

    <footer className="w-full px-8 py-4 bg-black text-white flex justify-between">
        <span>
            <ul className="flex gap-6">
                <a className="hover:border-b-2 border-yellow-300 transform hover:-translate-y-1 transition-all ease-in-out" href={"https://vitejs.dev/"} target={"_blank"} rel="noreferrer">
                    <SiVite size={48} color="#646CFF" />
                </a>
                <a className="hover:border-b-2 border-purple-900 transform hover:-translate-y-1 transition-all ease-in-out" href={"https://preactjs.com/"} target={"_blank"} rel="noreferrer" >
                    <img src={Preact} width={48} height={48} alt="Preact" />
                </a>
            </ul>
        </span>
        <span>
            <a className="flex p-1.5 cursor-pointer transition-all ease-in-out rounded-full hover:bg-slate-700 bg-slate-900  hover:ring-2 hover:ring-slate-200 " href={"https://github.com/lmedeiros-leiman"}>
                <SiRefinedgithub size={48} color="#9E95B7" />
            </a>
        </span>
    </footer>
</section >, document.getElementById('app')!)

