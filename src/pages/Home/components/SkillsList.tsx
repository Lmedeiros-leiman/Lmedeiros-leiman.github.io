import { FaBootstrap, FaDocker, FaGitAlt, FaLaravel, FaLinux, FaPython, FaReact } from "react-icons/fa6";
import { RiTailwindCssFill } from "react-icons/ri";
import { SiRefinedgithub, SiTypescript } from "react-icons/si";
import ToolTip from "../../../components/ToolTip";
import Title from "./Title";
import { _ } from "../context/LocaleContext";

export type Skill = {
    name: string;
    icon: React.ReactNode;
    color: string;
    square?: boolean;
};

const IconSize = 48;

const UsedSkills: Record<string, Skill> = {
    "React": {
        name: "React",
        color: "#61DAFB",
        icon: <FaReact size={IconSize} color={"#61DAFB"} />,
    },
    "Tailwind": {
        name: "Tailwind",
        color: "#06B6D4",
        icon: <RiTailwindCssFill size={IconSize} color={"#06B6D4"} />,
    },
    "Bootstrap": {
        name: "Bootstrap",
        color: "#7952B3",
        icon: <FaBootstrap size={IconSize} color={"#7952B3"} />,
    },
    "Python": {
        name: "Python",
        color: "#3776AB",
        icon: <FaPython size={IconSize} color="#3776AB" />,
    },
    "Laravel": {
        name: "Laravel",
        color: "#FF2D20",
        icon: <FaLaravel size={IconSize} color="#FF2D20" />,
        square: true,

    },
    "Docker": {
        name: "Docker",
        color: "#61DAFB",
        icon: <FaDocker size={IconSize} color={"#2496ED"} />,
    },
    "Git": {
        name: "Git",
        color: "#F05032",
        icon: <FaGitAlt size={IconSize} color={"#F05032"} />,
    },
    "Github": {
        name: "Github",
        color: "#9E95B7",
        icon: <SiRefinedgithub size={IconSize} color={"#9E95B7"} />,
    },
    "Typescript": {
        name: "Typescript",
        color: "#3178C6",
        icon: <SiTypescript size={IconSize} color={"#3178C6"} />,
        square: true,
    },
    "Linux": {
        name: "Linux",
        color: "#FCC624",
        icon: <FaLinux size={IconSize} color={ (window.matchMedia('(prefers-color-scheme: dark)').matches ? "white" : "black") } />,
    }

}



export const MySkillsList = () => {


    return (
        <div className="flex flex-col items-center w-full py-16 md:py-24">
            <Title>
                { _("ToolsTitleProjetos & Experiencias") }
            </Title>
            
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                {Object.keys(UsedSkills).map((key) => {
                    const skill = UsedSkills[key]

                    return (<>
                        <ToolTip content={skill.name} key={key}>
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg transform transition-transform hover:scale-105 ">
                                {skill.icon}
                            </div>
                        </ToolTip>
                    </>);
                })}
            </ul>
        </div>
    )
}

export default MySkillsList