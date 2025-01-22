import { render } from "preact";

import userAvatar from "./assets/user.png";

import "./main.css";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { BiHistory } from "react-icons/bi";
import { useState } from "preact/hooks";
import {
  MicrophoneIcon,
  PlusIcon,
} from "./assets/icons/YoutubeIcons";
import { HeaderSidebarGroup } from "./components/Header/HeaderSidebarGroup";
import { SearchBar } from "./components/Header/SearchBar";
import { NotificationPanel } from "./components/Header/Notification";

//bg-white/[0.1]

export const SidebarButton: React.FC<{
  children: preact.ComponentChildren;
  icon: preact.ComponentChildren;
  minimal?: Boolean;
}> = ({ children, icon, minimal = false }) => {
  return (
    <div
      className={
        (minimal
          ? " flex-col justify-center text-[10px] gap-1"
          : " text-sm gap-6 px-3 py-2") +
        " py-4 flex cursor-pointer items-center hover:bg-white/[0.1] rounded-lg"
      }
    >
      <div className="w-6 h-6">{icon}</div>
      <p>{children}</p>
    </div>
  );
};
export const SidebarButtonGroup: React.FC = ({ children }) => {
  return <ul className=" p-3 ">{children}</ul>;
};

export const EntryComponent = () => {
  const [visible, setVisibility] = useState(true);

  return (
    <>
      <main className="w-full min-h-screen flex flex-wrap bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
        <header className="flex ps-6 pe-10 justify-between gap-4 h-14 w-full  items-center ">
          <HeaderSidebarGroup
            onButtonClick={() => {
              setVisibility(!visible);
            }}
          />
          <SearchBar />

          <div className=" bg-black/5 dark:bg-white/10 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
            <MicrophoneIcon />
          </div>

          <div className="flex gap-6 items-center">
            <button className="flex items-center bg-black/5 dark:bg-white/10  rounded-full font-bold text-sm gap-0.5 px-2.5 py-1.5">
              <div>
                <PlusIcon />
              </div>
              <span>Create</span>
            </button>
          </div>
          <div className="relative flex items-center hover:bg-white/10 cursor-pointer  rounded-full p-2">
            <NotificationPanel />
          </div>
          

          <div className="w-8 h-8">
            <img src={"./assets/user.png"} />
          </div>
        </header>

        <section>
          <aside></aside>
          <article>
            <ul>
              <article>
                <picture>
                  <img className="w-full max-h-48" />
                </picture>
                <footer>
                  <div>
                    <img />
                  </div>
                  <div>
                    <h1></h1>
                    <p></p>
                    <small></small>
                  </div>
                </footer>
              </article>
            </ul>
          </article>
        </section>

        {/*
      <aside className={(visible ? "w-60" : "w-0") + "  transition-all"}>

        <header onClick={() => { setVisibility(!visible) }}
          className=" flex p-6 h-14 gap-6 items-center ">






        </header>
        <SidebarButtonGroup>
          <SidebarButton icon={<House />}>Home</SidebarButton>
          <SidebarButton icon={<Shorts />} >Shorts</SidebarButton>
          <SidebarButton icon={<Subscritions />} >Subscritions</SidebarButton>
        </SidebarButtonGroup>
        {
          (<>
            <SidebarButtonGroup>
              <SidebarButton icon={<span className="text-lg font-bold">You</span>}><ArrowRight /></SidebarButton>
              <SidebarButton icon={<House />}>Home</SidebarButton>
              <SidebarButton icon={<Shorts />} >Shorts</SidebarButton>
              <SidebarButton icon={<Subscritions />} >Subscritions</SidebarButton>
            </SidebarButtonGroup>
          </>)
        }


      </aside>
      <article className="bg-green-500 flex-grow">
        <header className="p-6 flex h-14 gap-6 items-center ">
          {
            !visible && (
              <section className=" flex h-14 gap-6 items-center" onClick={() => { setVisibility(!visible) }}>
                <div className="w-6 h-6 dark:fill-white fill-black">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
                    <path
                      d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z">
                    </path>
                  </svg>
                </div>
                <BrandIcon />
              </section>
            )
          }




        
        </header>
      </article>
      */}
      </main>
    </>
  );
};

render(<EntryComponent />, document.getElementById("app")!);

export const test = () => {
  return (
    <>
      <aside className=" w-60 dark:bg-[#282828] max-h-screen overflow-auto">
        <header className="flex px-5 justify-center items-center">
          <div className="  gap-6 h-14  items-center w-full flex"></div>
        </header>

        {/* First 3 options */}
        <ul className="w-full p-4 border-t border-gray-500"></ul>

        {/* You section */}
        <ul className="w-full p-4 border-t border-slate-500">
          <div className="flex cursor-pointer justify-start items-center gap-3 p-1.5 rounded-lg hover:bg-slate-700">
            You{" "}
            <span className="h-5 w-5">
              {" "}
              <ChevronRightIcon />{" "}
            </span>
          </div>
          <div className="flex cursor-pointer  items-center gap-4 p-1.5 rounded-lg hover:bg-slate-700">
            <BiHistory size={32} />
            <span>History</span>
          </div>
          <div className="flex cursor-pointer  items-center gap-4 p-1.5 rounded-lg hover:bg-slate-700">
            <span>Playlists</span>
          </div>
          <div className="flex cursor-pointer items-center gap-4 p-1.5 rounded-lg hover:bg-slate-700">
            <span>Your videos</span>
          </div>
          <div className="flex cursor-pointer  items-center gap-4 p-1.5 rounded-lg hover:bg-slate-700">
            <span>Watch later</span>
          </div>
          <div className="flex cursor-pointer  items-center gap-4 p-1.5 rounded-lg hover:bg-slate-700">
            <span>Liked videos</span>
          </div>
          <div className="flex cursor-pointer  items-center gap-4 p-1.5 rounded-lg hover:bg-slate-700">
            <span>Your clips</span>
          </div>
        </ul>

        {/* Subscribed channels */}
        <ul className="w-full p-4 border-t border-slate-500"></ul>

        {/* Explore */}
        <ul className="w-full p-4 border-t border-slate-500"></ul>

        {/* More of youtube */}
        <ul className="w-full p-4 border-t border-slate-500"></ul>

        {/* Config + extras */}
        <ul className="w-full p-4 border-t border-slate-500"></ul>

        {/* Footer extras */}
        <footer className="flex flex-wrap font-bold text-sm text-gray-300 gap-5 p-5 border-t border-slate-500">
          <p className="flex flex-wrap gap-1">
            <a href="https://www.youtube.com/about/">About</a>
            <a href="https://www.youtube.com/about/press/">Press</a>
            <a href="https://www.youtube.com/about/copyright/">Copyright</a>
            <a href="https://www.youtube.com/t/contact_us">Contact Us</a>
            <a href="https://www.youtube.com/creators/">Content Creators</a>
            <a href="https://www.youtube.com/ads">Publicity</a>
            <a href="https://developers.google.com/youtube">Developers</a>
          </p>
          <p className="flex flex-wrap gap-1">
            <a href="https://www.youtube.com/t/terms">Terms and Privacy</a>
            <a href="https://www.youtube.com/about/policies/">Safety Policy</a>
            <a href="https://www.youtube.com/howyoutubeworks/">
              How youtube works
            </a>
            <a href="https://www.youtube.com/new">Test new recources</a>
          </p>
          <p className="text-gray-700 font-light">© 2025 Google LLC</p>
        </footer>
      </aside>
      tify-between
      <header className="w-full bg-red-500">abc</header>
      <main className="flex w-full min-h-screen bg-white">
        <aside className="w-8 h-screen flex-col bg-red-500">
          <ul>
            <div></div>
          </ul>
        </aside>
      </main>
      <header className="flex px-4 h-14 w-full  justify-between items-center">
        <section>
          <input
            type="text"
            className="bg-[#333] text-white px-2 py-1 rounded-md"
            placeholder="Pesquisar"
          />
        </section>
        <section>
          <img src={userAvatar} className="w-8 h-8 bg-black rounded-full" />
        </section>
      </header>
    </>
  );
};
