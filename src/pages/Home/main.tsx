import { render } from "preact";

import AboutMeHero from "./components/AboutMe";
import Navbar from "./components/Navbar/Navbar";
import MySkillsList from "./components/SkillsList";
import MyProjectsList from "./components/ProjectsList";
import MadeWithFooter from "./components/MadeWithFooter";
import LocaleProvider from "./context/LocaleContext";
import { StrictMode } from "preact/compat";






render( 
<StrictMode>
<LocaleProvider>
  <section className="w-full max-w-screen-2xl  min-h-screen bg-gray-50 dark:bg-slate-900 dark:text-white">
   
    <Navbar />

    <AboutMeHero />
    
    <MySkillsList />
    
    <MyProjectsList />

    <MadeWithFooter />
  </section></LocaleProvider></StrictMode>,
  document.getElementById("app")!,
);
