import BrandIcon from "../BrandIcon";

export const HeaderSidebarGroup: React.FC<{ onButtonClick?: () => void }> = ({
  onButtonClick,
}) => {
  const userCountry = navigator.language.split("-")[1].toUpperCase();

  return (
    <div className="flex items-center gap-6">
      <div
        onClick={() => {
          if (onButtonClick != undefined) {
            onButtonClick();
          }
        }}
        className="w-6 h-6 dark:fill-white fill-black cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          focusable="false"
          aria-hidden="true"
          style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
        >
          <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path>
        </svg>
      </div>
      <span className=" h-full items-center flex">
        <BrandIcon />
        <span className="  text-[10px] text-gray-400 mb-[22px] ms-1">
          {userCountry}
        </span>
      </span>
    </div>
  );
};
