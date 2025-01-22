const IconBase: React.FC = ({ children }) => {
  return (
    <div className="w-full h-full block fill-black dark:fill-white">
      {children}
    </div>
  );
};

export const House = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path
        clip-rule="evenodd"
        d="M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5h-5v-7h-3v7h-5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146ZM18.5 9.621l-6.5-6.5-6.5 6.5V19.5H9V13a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v6.5h3.5V9.621Z"
        fill-rule="evenodd"
      ></path>
    </svg>
  </IconBase>
);

export const Shorts = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path
        clip-rule="evenodd"
        d="m7.61 15.719.392-.22v-2.24l-.534-.228-.942-.404c-.869-.372-1.4-1.15-1.446-1.974-.047-.823.39-1.642 1.203-2.097h.001L15.13 3.59c1.231-.689 2.785-.27 3.466.833.652 1.058.313 2.452-.879 3.118l-1.327.743-.388.217v2.243l.53.227.942.404c.869.372 1.4 1.15 1.446 1.974.047.823-.39 1.642-1.203 2.097l-.002.001-8.845 4.964-.001.001c-1.231.688-2.784.269-3.465-.834-.652-1.058-.313-2.451.879-3.118l1.327-.742Zm1.993 6.002c-1.905 1.066-4.356.46-5.475-1.355-1.057-1.713-.548-3.89 1.117-5.025a4.14 4.14 0 01.305-.189l1.327-.742-.942-.404a4.055 4.055 0 01-.709-.391c-.963-.666-1.578-1.718-1.644-2.877-.08-1.422.679-2.77 1.968-3.49l8.847-4.966c1.905-1.066 4.356-.46 5.475 1.355 1.057 1.713.548 3.89-1.117 5.025a4.074 4.074 0 01-.305.19l-1.327.742.942.403c.253.109.49.24.709.392.963.666 1.578 1.717 1.644 2.876.08 1.423-.679 2.77-1.968 3.491l-8.847 4.965ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z"
        fill-rule="evenodd"
      ></path>
    </svg>
  </IconBase>
);

export const Subscritions = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path
        clip-rule="evenodd"
        d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 6h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z"
        fill-rule="evenodd"
      ></path>
    </svg>
  </IconBase>
);

//
//

export const ArrowRight = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path d="M4.97 12.65 9.62 8 4.97 3.35l.71-.71L11.03 8l-5.35 5.35-.71-.7z"></path>
    </svg>
  </IconBase>
);

export const PlusIcon = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path d="M20 12h-8v8h-1v-8H3v-1h8V3h1v8h8v1z"></path>
    </svg>
  </IconBase>
);

export const NotificationIcon = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path
        clip-rule="evenodd"
        d="m13.497 4.898.053.8.694.4C15.596 6.878 16.5 8.334 16.5 10v2.892c0 .997.27 1.975.784 2.83L18.35 17.5H5.649l1.067-1.778c.513-.855.784-1.833.784-2.83V10c0-1.666.904-3.122 2.256-3.902l.694-.4.053-.8c.052-.78.703-1.398 1.497-1.398.794 0 1.445.618 1.497 1.398ZM6 10c0-2.224 1.21-4.165 3.007-5.201C9.11 3.236 10.41 2 12 2c1.59 0 2.89 1.236 2.993 2.799C16.79 5.835 18 7.776 18 10v2.892c0 .725.197 1.436.57 2.058l1.521 2.535c.4.667-.08 1.515-.857 1.515H15c0 .796-.316 1.559-.879 2.121-.562.563-1.325.879-2.121.879s-1.559-.316-2.121-.879C9.316 20.56 9 19.796 9 19H4.766c-.777 0-1.257-.848-.857-1.515L5.43 14.95c.373-.622.57-1.333.57-2.058V10Zm4.5 9c0 .398.158.78.44 1.06.28.282.662.44 1.06.44s.78-.158 1.06-.44c.282-.28.44-.662.44-1.06h-3Z"
        fill-rule="evenodd"
      ></path>
    </svg>
  </IconBase>
);

export const SearchIcon = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path
        clip-rule="evenodd"
        d="M16.296 16.996a8 8 0 11.707-.708l3.909 3.91-.707.707-3.909-3.909zM18 11a7 7 0 00-14 0 7 7 0 1014 0z"
        fill-rule="evenodd"
      ></path>
    </svg>
  </IconBase>
);
export const MicrophoneIcon = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path d="M12 3c-1.66 0-3 1.37-3 3.07v5.86c0 1.7 1.34 3.07 3 3.07s3-1.37 3-3.07V6.07C15 4.37 13.66 3 12 3zm6.5 9h-1c0 3.03-2.47 5.5-5.5 5.5S6.5 15.03 6.5 12h-1c0 3.24 2.39 5.93 5.5 6.41V21h2v-2.59c3.11-.48 5.5-3.17 5.5-6.41z"></path>
    </svg>
  </IconBase>
);

export const VerticalTripleDots = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"></path>
    </svg>
  </IconBase>
);

export const BellIconSlashed = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path d="m3.85 3.15-.7.7 3.48 3.48C6.22 8.21 6 9.22 6 10.32v5.15l-2 1.88V19h14.29l1.85 1.85.71-.71-17-16.99zM5 18v-.23l2-1.88v-5.47c0-.85.15-1.62.41-2.3L17.29 18H5zm5 2h4c0 1.1-.9 2-2 2s-2-.9-2-2zM9.28 5.75l-.7-.7c.43-.29.9-.54 1.42-.7v-.39c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v4.14l-1-1v-3.05c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03-.27.11-.51.24-.75.4z"></path>
    </svg>
  </IconBase>
);

export const EyeIconSlashed = () => (
  <IconBase>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      aria-hidden="true"
      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
    >
      <path d="m3.85 3.15-.7.7L6.19 6.9C4.31 8.11 2.83 9.89 2 12c1.57 3.99 5.45 6.82 10 6.82 1.77 0 3.44-.43 4.92-1.2l3.23 3.23.71-.71L3.85 3.15zM13.8 14.5c-.51.37-1.13.59-1.8.59-1.7 0-3.09-1.39-3.09-3.09 0-.67.22-1.29.59-1.8l4.3 4.3zM12 17.82c-3.9 0-7.35-2.27-8.92-5.82.82-1.87 2.18-3.36 3.83-4.38L8.79 9.5c-.54.69-.88 1.56-.88 2.5 0 2.25 1.84 4.09 4.09 4.09.95 0 1.81-.34 2.5-.88l1.67 1.67c-1.27.61-2.69.94-4.17.94zm-.51-9.87c.17-.02.34-.05.51-.05 2.25 0 4.09 1.84 4.09 4.09 0 .17-.02.34-.05.51l-1.01-1.01c-.21-1.31-1.24-2.33-2.55-2.55l-.99-.99zM9.12 5.59c.92-.26 1.88-.41 2.88-.41 4.55 0 8.43 2.83 10 6.82-.58 1.47-1.48 2.78-2.61 3.85l-.72-.72c.93-.87 1.71-1.92 2.25-3.13C19.35 8.45 15.9 6.18 12 6.18c-.7 0-1.39.08-2.06.22l-.82-.81z"></path>
    </svg>
  </IconBase>
);
