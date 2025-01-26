import type { FC } from "preact/compat";
import {
  useRef,
  useState,
  type Dispatch,
  type StateUpdater,
} from "preact/hooks";

const SelectableButton: FC = ({ children }) => {
  const [selected, setSelected] = useState(false);

  return (
    <button onClick={() => setSelected(!selected)} className={ (selected ? " bg-black/20 dark:bg-white/20 " : "  bg-black/10 dark:bg-white/10 ") + " font-semibold rounded-md cursor-pointer text-sm m-3 min-w-3 h-8 px-3 ms-0"}>
      {children}
    </button>
  );
};

const ScrollableFixedHeightMenu: FC = ({ children }) => {
  const scrollRef = useRef<HTMLUListElement>(null);


  return (
    <ul className={ " scroll-smooth flex-nowrap overflow-x-auto whitespace-nowrap px-6 py-0 "} ref={scrollRef}>
      {children}
    </ul>
  );
};

export const HomePage: FC<{
  pageController: Dispatch<StateUpdater<string>>;
}> = ({ pageController }) => {
  return (
    <article className="flex-grow w-min overflow-x-hidden">
      <header className="flex w-full ">
        <ScrollableFixedHeightMenu>
          <button className=" text-white rounded-md font-semibold bg-[#0f0f0f] dark:bg-white dark:text-black cursor-pointer min-w-3 h-8 px-3 text-sm m-3 ms-0">All</button>
          <SelectableButton>Sports</SelectableButton>
          <SelectableButton>Videogames</SelectableButton>
          <SelectableButton>Television</SelectableButton>
          <SelectableButton>Reading</SelectableButton>
          <SelectableButton>Lord of the rings</SelectableButton>
          <SelectableButton>Reading</SelectableButton>
          <SelectableButton>Testing</SelectableButton>
          <SelectableButton>Coding</SelectableButton>
          <SelectableButton>Test</SelectableButton>
          <SelectableButton>Art</SelectableButton>
          <SelectableButton>Showcase</SelectableButton>
          <SelectableButton>Dragon Ball</SelectableButton>

          <SelectableButton>Dragon Ball</SelectableButton>
          <SelectableButton>Dragon Ball</SelectableButton>
          <SelectableButton>Dragon Ball</SelectableButton>
          <SelectableButton>Dragon Ball</SelectableButton>

        </ScrollableFixedHeightMenu>
      </header>
      <ul className="w-full ">b</ul>
    </article>
  );
};
