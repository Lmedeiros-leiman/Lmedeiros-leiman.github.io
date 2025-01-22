import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { NotificationIcon } from "../../assets/icons/YoutubeIcons";

export const NotificationPanel = () => {
  return (
    <Menu >
      <MenuButton>
        <NotificationIcon />
        <div className="absolute top-1 select-none -right-0.5 bg-[#e1002d] border-2 border-solid border-[#000000cc] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center  ">
          20
        </div>
      </MenuButton>
      <MenuItems 
        anchor="left" 
        className="absolute flex flex-grow w-[480px] h-[642px] p-2 bg-white dark:bg-[#282828] text-black dark:text-white left-full mr-2 mt-4 rounded-lg "
      >
        <MenuItem>
          <div>a</div>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

