import { SiRefinedgithub, SiVite } from "react-icons/si";

import Preact from "../../assets/preact.svg";



export const MadeWithFooter = () => {
  return (<>
  <footer className="w-full px-8 py-4 bg-black text-white flex justify-between">
      <span>
        <ul className="flex gap-6">
          <a
            className="hover:border-b-2 border-yellow-300 transform hover:-translate-y-1 transition-all ease-in-out"
            href={"https://vitejs.dev/"}
            target={"_blank"}
            rel="noreferrer"
          >
            <SiVite size={48} color="#646CFF" />
          </a>
          <a
            className="hover:border-b-2 border-purple-900 transform hover:-translate-y-1 transition-all ease-in-out"
            href={"https://preactjs.com/"}
            target={"_blank"}
            rel="noreferrer"
          >
            <img src={Preact} width={48} height={48} alt="Preact" />
          </a>
        </ul>
      </span>
      <span>
        <a
          className="flex p-1.5 cursor-pointer transition-all ease-in-out rounded-full hover:bg-slate-700 bg-slate-900  hover:ring-2 hover:ring-slate-200 "
          href={"https://github.com/lmedeiros-leiman"}
        >
          <SiRefinedgithub size={48} color="#9E95B7" />
        </a>
      </span>
    </footer>
  </>)
}
export default MadeWithFooter;