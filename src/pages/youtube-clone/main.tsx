import { render } from "preact";
import BrandIcon from "./components/BrandIcon";

import userAvatar from "./assets/user.png";

import "../../index.css";
import "./main.css";

render(
  <div className="w-full min-h-screen dark:bg-[#282828] dark:text-white text-black bg-white ">
    <header className="flex px-4 h-14 w-full  justify-between items-center">
      <BrandIcon />
      <section>
        <input
          type="text"
          className="bg-[#333] text-white px-2 py-1 rounded-md"
          placeholder="Pesquisar"
        />
      </section>
      <section>
        <img src={userAvatar} className="w-8 h-8 bg-black rounded-full" />
      </section>
    </header>
  </div>,
  document.getElementById("app")!,
);
