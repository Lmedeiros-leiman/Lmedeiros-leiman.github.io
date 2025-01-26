import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useLocale, validLocales } from "../../context/LocaleContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const LocalePicker = () => {
  const { changeLocale, locale, busy } = useLocale();

  return (
    <Menu>
      <MenuButton
        disabled={busy}
        className={
          " p-0.5 select-none bg-black hover:bg-slate-900 text-white hover:cursor-pointer transition-all  hover:ring-2 rounded-lg ring:ring-white "
        }
      >
        <div className="flex py-1 px-1.5 justify-between w-full gap-1 items-center text-nowrap">
          {validLocales[locale as keyof typeof validLocales]}
          {busy ? (
            <div class="loader w-6 h-6"></div>
          ) : (
            <span className="w-6 h-6">
              <ChevronDownIcon />{" "}
            </span>
          )}
        </div>
      </MenuButton>

      <MenuItems
        anchor="bottom"
        className="dark:bg-black bg-white text-black dark:text-white border dark:border-slate-600 text-lg select-none font-bold rounded-lg py-2"
      >
        {Object.keys(validLocales).map((localeKey) => {
          return (
            <MenuItem>
              <div
                onClick={() => {
                  changeLocale(localeKey as keyof typeof validLocales);
                }}
                className=" hover:bg-slate-200 dark:hover:bg-slate-900 px-5"
              >
                {validLocales[localeKey as keyof typeof validLocales]}
              </div>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
};
export default LocalePicker;
