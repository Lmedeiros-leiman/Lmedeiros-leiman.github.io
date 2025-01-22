import { useState } from "preact/hooks";
import { SearchIcon } from "../../assets/icons/YoutubeIcons";
import { FaHistory } from "react-icons/fa";

export const HistoryItem: React.FC = ({ children }) => {
  return (
    <div className="flex justify-between w-full py-1 px-5 cursor-default hover:bg-black/10 dark:hover:bg-white/10">
      <div className="flex gap-5 items-center ">
        <span>
          <FaHistory />{" "}
        </span>
        <span>{children}</span>
      </div>
      <aside className="text-[#3ea6ff] cursor-pointer text-sm hover:underline">Remove</aside>
    </div>
  );
};

export const SearchBar = () => {
  const [showDropdown, setDropdown] = useState(false);

  return (
    <>
      <div className="flex flex-grow justify-center px-4 ms-10">
        <form className="w-full relative ms-8 flex  ">
          <div className="w-full flex ps-5  rounded-s-full items-center border border-black/20 dark:border-[#303030]   dark:bg-[#121212] focus-within:border-blue-600">
            <div
              className={
                (showDropdown ? "block" : "hidden") +
                " mr-2 w-8 flex  h-full items-center"
              }
            >
              <span>
                <SearchIcon />
              </span>
            </div>

            <form className=" flex flex-grow-0 flex-shrink-1 basis-[732px] ">
              <input
                onFocus={() => {
                  setDropdown(true);
                }}
                onSelect={() => {
                  setDropdown(true);
                }}
                onBlur={() => {
                  setDropdown(false);
                }}
                placeholder="Search"
                className=" my-2 bg-transparent flex-1 block focus:border-none focus:outline-none"
              />
            </form>

            <button className=" mx-2 w-max min-w-5 h-max ">
              <img
                width="100%"
                height="100%"
                src="//www.gstatic.com/inputtools/images/tia.png"
              />
            </button>
          </div>

          <div className=" bg-[#f8f8f8] hover:bg-[#e4e4e4] dark:bg-[white/10]  cursor-pointer border border-s-0 border-black/20 dark:border-[#303030] w-16 flex flex-shrink-0 justify-center rounded-e-full h-full items-center">
            <span className="text-4xl ">
              <SearchIcon />
            </span>
          </div>

          <div
            className={
              (showDropdown ? "block" : "hidden") +
              " rounded-xl pt-4 pb-2 min-w-[544px] shadow-2xl w-max absolute top-[44px] z-40 left-0 bg-white dark:bg-[#212121]"
            }
          >
            <ul>
              {Array.from({ length: 10 }, (_, i) => (
                <HistoryItem key={i}>
                  {"Lorem ipsum dolor sit amet consectetur adipiscing elit"
                    .split(" ")
                    .slice(0, Math.floor(Math.random() * 9) + 1)
                    .join(" ")}
                </HistoryItem>
              ))}
            </ul>
          </div>
        </form>
      </div>
    </>
  );
};
