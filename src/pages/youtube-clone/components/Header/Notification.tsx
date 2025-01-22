import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { NotificationIcon } from "../../assets/icons/YoutubeIcons";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export const NotificationBox = () => {

  return (<div className="flex w-full">

  </div>)
}


export const NotificationPanel = () => {
  return (
    <Popover>
      <PopoverButton className="w-6 h-6 flex focus:outline-none">
        <NotificationIcon />
        <div className="absolute top-1 select-none -right-0.5 bg-[#e1002d] border-2 border-solid border-[#000000cc] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center  ">
          20
        </div>
      </PopoverButton>
      <PopoverPanel 
        anchor="left" 
        className="absolute flex flex-grow w-[480px] h-[642px] p-0 bg-white dark:bg-[#282828] text-black dark:text-white left-full  mt-4 rounded-lg "
      >
        
        <div className="w-full h-full">
          <header className="flex w-full ps-4 pe-2 py-0.5 items-center justify-between border-b border-white/20 ">
            <div>Notifications</div>
            <div className="w-9 h-9 cursor-pointer bg-transparent hover:bg-white/10 rounded-full p-1">
              <Cog6ToothIcon />
            </div>
          </header>
            
            <ul>

            </ul>
          </div>
        
      </PopoverPanel>
    </Popover>
  );
};

