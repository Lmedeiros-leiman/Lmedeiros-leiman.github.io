import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { FC } from "preact/compat";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type StateUpdater,
} from "preact/hooks";

const SelectableButton: FC = ({ children }) => {
  const [selected, setSelected] = useState(false);

  return (
    <button
      onClick={() => setSelected(!selected)}
      className={
        (selected
          ? " bg-black/20 dark:bg-white/20 "
          : "  bg-black/10 dark:bg-white/10 ") +
        " font-semibold rounded-md cursor-pointer text-sm m-3 min-w-3 h-8 px-3 ms-0"
      }
    >
      {children}
    </button>
  );
};

const ScrollableFixedHeightMenu: FC = ({ children }) => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollAmmount = 100;

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    updateScrollState();

    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", updateScrollState);
      return () => ref.removeEventListener("scroll", updateScrollState);
    }
  }, []);

  return (
    <div className=" relative w-full  justify-center items-center flex">
      {canScrollLeft && (
        <div className="absolute flex top-0 left-0 z-10  h-full items-center">
          <button onClick={scrollLeft} className="w-10 h-full bg-[#0f0f0f]">
            <ChevronLeftIcon height={24} />
          </button>
          <aside className="w-[50px] h-full  bg-gradient-to-r from-[#0f0f0f] to-transparent"></aside>
        </div>
      )}
      {canScrollRight && (
        <div className="absolute flex top-0 right-0 z-10  h-full items-center">
          <aside className="w-[50px] h-full  bg-gradient-to-l from-[#0f0f0f] from-30% to-[#21212100] to-80%"></aside>
          <button onClick={scrollRight} className="w-10 h-full bg-[#0f0f0f]">
            <ChevronRightIcon height={24} />
          </button>
        </div>
      )}
      <ul
        className=" relative scroll-smooth flex-nowrap overflow-x-hidden whitespace-nowrap px-6 py-0 "
        ref={scrollRef}
      >
        {children}
      </ul>
    </div>
  );
};

export const TagsMenu: FC = () => {
  return (
    <ScrollableFixedHeightMenu>
      <button className=" text-white rounded-md font-semibold bg-[#0f0f0f] dark:bg-white dark:text-black cursor-pointer min-w-3 h-8 px-3 text-sm m-3 ms-0">
        All
      </button>
      <SelectableButton>Sports</SelectableButton>
      <SelectableButton>Videogames</SelectableButton>
      <SelectableButton>Minecraft</SelectableButton>
      <SelectableButton>Board Games</SelectableButton>
      <SelectableButton>Commics</SelectableButton>
      <SelectableButton>Television</SelectableButton>
      <SelectableButton>Game of thrones</SelectableButton>
      <SelectableButton>Reading</SelectableButton>
      <SelectableButton>Lord of the rings</SelectableButton>
      <SelectableButton>Reading</SelectableButton>
      <SelectableButton>Testing</SelectableButton>
      <SelectableButton>Coding</SelectableButton>
      <SelectableButton>Test</SelectableButton>
      <SelectableButton>Art</SelectableButton>
      <SelectableButton>Showcase</SelectableButton>
      <SelectableButton>Dragon Ball</SelectableButton>
    </ScrollableFixedHeightMenu>
  );
};

const VideoItem: FC = () => {
  return (
    <div className="min-w-80 max-w-5  mb-8  ms-4  ">
      <div className="relative bg-red-200 w-full rounded-lg overflow-hidden">
        <img
          className=" w-full h-auto"
          width={360}
          height={180}
          src="https://placehold.co/600x400"
          alt="Video thumbnail"
        />
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
          12:34
        </span>
      </div>

      <div className="flex mt-2">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300"></div>

        <div className="ml-3">
          <h1 className="text-sm font-semibold dark:text-white text-gray-900 line-clamp-2">
            Video Title That Is Long and Needs to Be Clamped
          </h1>
          <p className="text-xs text-gray-500">Uploader Name</p>
          <footer className="text-xs text-gray-500">
            890K views • 1 year ago
          </footer>
        </div>
      </div>
    </div>
  );
};

export const HomePage: FC<{
  _pageController?: Dispatch<StateUpdater<string>>;
}> = ({ _pageController }) => {
  return (
    <article className="flex-grow w-min overflow-x-hidden">
      <TagsMenu />

      <ul className="w-full pt-6 gap-5 flex flex-wrap justify-start">
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
      </ul>
    </article>
  );
};
