import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  BellIconSlashed,
  EyeIconSlashed,
  NotificationIcon,
  VerticalTripleDots,
} from "../../assets/icons/YoutubeIcons";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import AvatarImage from "../../assets/user.png";
import type { ComponentChildren } from "preact";

export const NotificationChoiceButton: React.FC<{
  children: ComponentChildren;
  icon?: ComponentChildren;
}> = ({ children, icon }) => {
  return <div className="flex hover:bg-black/10 dark:hover:bg-white/10 px-2 py-2">
    <span>{icon}</span>
    <span>{children}</span>
  </div>;
};

export const NotificationBox: React.FC = ({ children }) => {
  const showAsNew = Math.random() > 0.5;
  const postedAgo = Math.trunc(Math.random() * 10);

  const user = "@User";

  return (
    <div className="flex w-full py-2.5 px-0 hover:bg-black/10 dark:hover:bg-white/10 mr-6 flex-row text-sm scroll">
      <div
        className={
          (showAsNew ? " bg-[#3ea6ff] " : " bg-transparent ") +
          " w-1 h-1 mt-[22px] mr-[6px] mb-0 flex-shrink-0 rounded-full"
        }
      ></div>

      <picture className="mr-4 flex-shrink-0">
        <img width={48} height={48} src={AvatarImage} />
      </picture>

      <article className="flex-grow flex flex-col mb-2 ">
        {user} replied : "{children}"
        <footer className=" text-[#AAAAAA] text-xs ">
          Posted {postedAgo} days ago
        </footer>
      </article>
      <picture className=" mx-4 w-[86px] h-[48px] bg-blue-300">
        <img src="#" width={86} height={48} />
      </picture>

      <Popover>
        <PopoverButton className="w-6 h-6 mr-4">
          <VerticalTripleDots />
        </PopoverButton>
        <PopoverPanel
          anchor="left"
          className="absolute flex flex-grow w-[480px] shadow bg-white dark:bg-[#282828] text-black dark:text-white left-full  mt-4 rounded-lg"
        >
          <ul className="w-full py-2">
            <NotificationChoiceButton icon={<EyeIconSlashed />} >Hide notification</NotificationChoiceButton>
            <NotificationChoiceButton icon={<BellIconSlashed/>} >Silence {user}</NotificationChoiceButton>
            <NotificationChoiceButton icon={<BellIconSlashed/>} >Disable comment notifications</NotificationChoiceButton>
          </ul>
        </PopoverPanel>
      </Popover>
    </div>
  );
};

export const NotificationPanel = () => {
  return (
    <Popover>
      <PopoverButton className="w-6 h-6 flex focus:outline-none ">
        <NotificationIcon />
        <div className="absolute top-1 select-none -right-0.5 bg-[#e1002d] border-2 border-solid border-[#000000cc] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center  ">
          20
        </div>
      </PopoverButton>
      <PopoverPanel
        anchor="left"
        className="absolute shadow-2xl flex flex-grow w-[480px] h-[642px] p-0 bg-white dark:bg-[#282828] text-black dark:text-white left-full  mt-4 rounded-lg "
      >
        <div className="w-full h-full">
          <header className="flex w-full ps-4 pe-2 pt-2 pb-1 items-center justify-between border-b border-white/20 ">
            <div>Notifications</div>
            <div className="w-9 h-9 cursor-pointer bg-transparent hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-1">
              <Cog6ToothIcon />
            </div>
          </header>

          <ul className="overflow-y-auto overflow-x-hidden w-full ">
            {Array.from({ length: 10 }, (_, i) => (
              <NotificationBox key={i}>
                {"Lorem ipsum dolor sit amet consectetur adipiscing elit"
                  .split(" ")
                  .slice(0, Math.floor(Math.random() * 9) + 1)
                  .join(" ")}
              </NotificationBox>
            ))}
          </ul>
        </div>
      </PopoverPanel>
    </Popover>
  );
};
