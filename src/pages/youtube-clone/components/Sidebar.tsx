import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  ArrowRight,
  BagIcon,
  ClockIcon,
  ExclamationBubbleIcon,
  FlagIcon,
  FlameIcon,
  GameIcon,
  GraduationIcon,
  HelpBubbleIcon,
  HistoryIcon,
  House,
  LiveIcon,
  MovieIcon,
  MusicIcon,
  NewsIcon,
  PlaylistIcon,
  PodcastIcon,
  ScissorsIcon,
  Shorts,
  Subscriptions,
  ThumbsUpIcon,
  TrophyIcon,
  VideosIcon,
  YouIcon,
  YoutubeLogoIcon,
  YoutubeMusicLogoIcon,
  YoutubeSlantedLogoIcon,
  YoutubeStudioLogoIcon,
} from "../assets/icons/YoutubeIcons";
import { HeaderSidebarGroup } from "./Header/HeaderSidebarGroup";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import UserAvatar from "../assets/user.png";

const SidebarCompactButton: React.FC<{
  children: ComponentChildren;
  icon: ComponentChildren;
}> = ({ children, icon }) => {
  return (
    <button className=" bg-transparent hover:bg-black/10 dark:hover:bg-white/10 w-16 py-4 gap-1 rounded-lg text-[10px] flex flex-col justify-center items-center">
      <div className="w-6 h-6 ">{icon}</div>
      <span> {children} </span>
    </button>
  );
};

const SubscribedChannelButton: React.FC<{
  children: ComponentChildren;
  icon: ComponentChildren;
  notify: boolean;
}> = ({ children, icon, notify = false }) => {
  return (
    <button className="flex cursor-pointer items-center gap-5 px-2.5 py-2 box-border w-full text-sm rounded-lg hover:bg-black/10 dark:hover:bg-white/10">
      <div className="w-6 h-6 ">{icon}</div>
      <span>{children}</span>
      {notify && <span className="w-1 h-1 rounded-full bg-[#3ea6ff]"></span>}
    </button>
  );
};

const SidebarButton: React.FC<{
  children: ComponentChildren;
  icon: ComponentChildren;
}> = ({ children, icon }) => {
  return (
    <button className="flex cursor-pointer items-center gap-5 px-2.5 py-2 box-border w-full text-sm rounded-lg hover:bg-black/10 dark:hover:bg-white/10">
      <div className="w-6 h-6 ">{icon}</div>
      <span>{children}</span>
    </button>
  );
};

const SidebarGroupSeparator: React.FC = () => {
  return (
    <div className="w-full h-4 border-t dark:border-t-white/20 border-t-black/20  "></div>
  );
};

const SidebarButtonGroup: React.FC<{ children: ComponentChildren }> = ({
  children,
}) => {
  return <ul className={" w-full px-2.5 py-2"}>{children}</ul>;
};

const FullSidebar: React.FC<{
  showBrand: boolean;
  onBrandClick: () => void;
}> = ({ showBrand, onBrandClick }) => {
  return (
    <>
      {showBrand && (
        <header className="flex ps-5 pe-10 justify-between gap-4 h-14 w-full  items-center ">
          <HeaderSidebarGroup onButtonClick={onBrandClick} />
        </header>
      )}
      {/* Main Selection */}
      <SidebarButtonGroup>
        <SidebarButton icon={<House />}>Home</SidebarButton>
        <SidebarButton icon={<Shorts />}>Shorts</SidebarButton>
        <SidebarButton icon={<Subscriptions />}>Subscritions</SidebarButton>
      </SidebarButtonGroup>

      {/* You Section */}
      <SidebarButtonGroup>
        <SidebarGroupSeparator />
        <SidebarButton icon={<span className="font-bold text-base">You</span>}>
          <ArrowRight />
        </SidebarButton>
        <SidebarButton icon={<HistoryIcon />}>Historic</SidebarButton>
        <SidebarButton icon={<PlaylistIcon />}>Playlists</SidebarButton>
        <SidebarButton icon={<VideosIcon />}>Your videos</SidebarButton>
        <SidebarButton icon={<ClockIcon />}>Watch later</SidebarButton>
        <SidebarButton icon={<ThumbsUpIcon />}>Liked videos</SidebarButton>
        <SidebarButton icon={<ScissorsIcon />}>Your clips</SidebarButton>
      </SidebarButtonGroup>

      {/* Subscriptions */}
      <SidebarButtonGroup>
        <SidebarGroupSeparator />
        <strong className=" pt-[6px] px-[12px] pb-[4px] text-base">
          Subscriptions
        </strong>
        {Array.from({ length: 5 }).map((_, _ind) => {
          return (
            <>
              <SubscribedChannelButton
                icon={<img src={UserAvatar} alt={"Channel Logo"} />}
                notify={Math.random() > 0.5}
              >
                User Channel
              </SubscribedChannelButton>
            </>
          );
        })}
      </SidebarButtonGroup>

      {/* Explore section */}
      <SidebarButtonGroup>
        <SidebarGroupSeparator />
        <strong className=" pt-[6px] px-[12px] pb-[4px] text-base">
          Explore
        </strong>
        <SidebarButton icon={<FlameIcon />}>Trending</SidebarButton>
        <SidebarButton icon={<BagIcon />}>Shopping</SidebarButton>
        <SidebarButton icon={<MusicIcon />}>Music</SidebarButton>
        <SidebarButton icon={<MovieIcon />}>Movies</SidebarButton>
        <SidebarButton icon={<LiveIcon />}>Live</SidebarButton>
        <SidebarButton icon={<GameIcon />}>Games</SidebarButton>
        <SidebarButton icon={<NewsIcon />}>News</SidebarButton>
        <SidebarButton icon={<TrophyIcon />}>Sports</SidebarButton>
        <SidebarButton icon={<GraduationIcon />}>Courses</SidebarButton>
        <SidebarButton icon={<PodcastIcon />}>Podcasts</SidebarButton>
      </SidebarButtonGroup>

      {/* More youtube */}
      <SidebarButtonGroup>
        <SidebarGroupSeparator />
        <SidebarButton icon={<YoutubeLogoIcon />}>
          Youtube Premium
        </SidebarButton>
        <SidebarButton icon={<YoutubeStudioLogoIcon />}>
          Youtube Studio
        </SidebarButton>
        <SidebarButton icon={<YoutubeMusicLogoIcon />}>
          Youtube Music
        </SidebarButton>
        <SidebarButton icon={<YoutubeSlantedLogoIcon />}>
          Youtube Kids
        </SidebarButton>
      </SidebarButtonGroup>

      {/* Config options */}
      <SidebarButtonGroup>
        <SidebarGroupSeparator />
        <SidebarButton icon={<Cog6ToothIcon />}>Configurations</SidebarButton>
        <SidebarButton icon={<FlagIcon />}>Reports History</SidebarButton>
        <SidebarButton icon={<HelpBubbleIcon />}>Help</SidebarButton>
        <SidebarButton icon={<ExclamationBubbleIcon />}>
          Send feedback
        </SidebarButton>
      </SidebarButtonGroup>

      {/* Footer extras */}
      <footer className="flex flex-col font-bold text-sm text-gray-300 gap-5 p-4 w-full ">
        <SidebarGroupSeparator />
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

        <p className="text-gray-700 font-light ">© 2025 Google LLC</p>
      </footer>
    </>
  );
};

const MinimalSidebar = () => {
  return (
    <>
      <aside className="p-1 gap-0 flex flex-col h-full w-min  fixed top-14 left-0 bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
        <SidebarCompactButton icon={<House />}>Home</SidebarCompactButton>
        <SidebarCompactButton icon={<Shorts />}>Shorts</SidebarCompactButton>
        <SidebarCompactButton icon={<Subscriptions />}>
          Subscriptions
        </SidebarCompactButton>
        <SidebarCompactButton icon={<YouIcon />}>You</SidebarCompactButton>
      </aside>
    </>
  );
};

export const Sidebar: React.FC<{
  children?: ComponentChildren;
  visible: boolean;
  showSidebar?: boolean;
  onInnerButtonClick: () => void;
}> = ({ visible, onInnerButtonClick, showSidebar = true }) => {
  // checks what sidebar to render
  // between the compactable sidebar OR the modal sidebar.

  const [ScreenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const IsBigScreen = ScreenWidth < 1280;

  if (IsBigScreen) {
    return (
      <>
        {visible ? (
          <aside className="p-1 gap-3 flex flex-col h-full overflow-auto w-60 fixed top-14 pb-14 left-0 bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
            <FullSidebar showBrand={false} onBrandClick={onInnerButtonClick} />
          </aside>
        ) : (
          <MinimalSidebar />
        )}
      </>
    );
  }


  return (<>
  { ( showSidebar && !IsBigScreen && (<aside> <MinimalSidebar  /></aside>)) }
  <div className="w-full ">
    <div className={ (visible ? " w-full  " : " w-0 ") + " z-40 h-screen fixed  top-0 left-0  bg-black/50"}></div>
    <aside className={ (visible ? " w-60" : " w-0") +"  z-50 h-screen fixed top-0 left-0 transition-all bg-white dark:bg-[#0f0f0f] text-black dark:text-white"}>
      { visible && <FullSidebar showBrand={true} onBrandClick={onInnerButtonClick} />}
    </aside>
    
  </div>
  </>);
};
