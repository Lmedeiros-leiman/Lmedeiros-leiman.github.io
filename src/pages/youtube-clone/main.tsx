import "./main.css";

import { render } from "preact";

import { useState } from "preact/hooks";
import { MicrophoneIcon, PlusIcon } from "./assets/icons/YoutubeIcons";
import { HeaderSidebarGroup } from "./components/Header/HeaderSidebarGroup";
import { SearchBar } from "./components/Header/SearchBar";
import { NotificationPanel } from "./components/Header/Notification";
import { Sidebar } from "./components/Sidebar";

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
  const [visible, setVisibility] = useState(false);
  const [showSidebar, _SetShowSidebar] = useState(true);

  return (
    <>
      <main className="w-full min-h-screen flex flex-wrap bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
        <header className="flex ps-6 pe-10 justify-between gap-4 h-14 w-full  items-center fixed top-0 left-0 z-30 bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
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

        <section className="bg-green-400 w-full min-h-screen">
          <Sidebar showSidebar={showSidebar}
            onInnerButtonClick={() => {
              setVisibility(!visible);
            }}
            visible={visible}
          ></Sidebar>
          <article>
            <div className=" h-screen">
              Muehehehehe
            </div>
            <div className=" h-screen">
              Muehehehehe
            </div>
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

      
      </main>
    </>
  );
};

render(<EntryComponent />, document.getElementById("app")!);
