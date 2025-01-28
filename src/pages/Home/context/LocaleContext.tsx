import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { WebFetcher } from "../../../libs/WebFetcher";

export type TranslationKeys = {
  Name: string;
  Position: string;
  ToolsTitle: string;
  ProjectsTitle: string;
};

export type LocaleDataType = {
  busy: boolean;
  locale: string;
  localeLong: string;
  Translations: Record<string, string>;
  changeLocale: (newLanguage: keyof typeof validLocales) => void;
};

export const validLocales = {
  en: "🇺🇸 En-US",
  pt: "🇧🇷 Pt-BR",
};

const DefaultTranslations = {
  Name: "Leonardo Medeiros Leiman",
  Position: "Full Stack Developer",
  ToolsTitle: "My favorite tools",
  ProjectsTitle: "Projects & Experiences",
  YoutubeProjectTitle: "Youtube Clone",
  YoutubeProjectDescription:
    "A simple reconstruction project of the youtube main pages using Tailwind CSS and React trying to be as loyal as possible to the source material. The colours and icons were extracted using SnipCSS, a chrome web browser extension, and the built in developer tools. \n \n The project was suprisingly difficult in the beggining, since i wanted to start out with the header bar and the sidebar, the header was all about flex and justify-between tricks, a lot of youtube html is made thinking about old browsers, so a bunch of the source material just used weird margins while others used flexbox, the old deprecated call for a flex box in CSS. \n \n The hardest part of the project was making the Sidebar. it has Three main states that depend on some external factors. the first of witch was the page total width, showing a minimal sidebar if its too small or the default expanded bar. not forgeting that the sidebar also has a Modal/Drawer that you can call by clicking on the button to the left of the brand icon. \n \n After getting the details fixed in it wasnt an issue getting the page to show a light or dark mode using the new 'dark:' tailwind command, surprisingly a lot of Youtube dark mode is just a base #f8f8f8 dark colour with gray components actually being a pure white component with an opacity to the background, usualy showing 10-20% from 100%.",

  Building: "Building",
  Finished: "Finished",
  "Small Tweaks": "Small Tweaks",
  Planning: "Planning",
};

const InitialData: LocaleDataType = {
  locale: "en",
  localeLong: validLocales.en,
  changeLocale: () => {},
  busy: false,
  Translations: DefaultTranslations,
};

const LocaleContext = createContext<LocaleDataType>(InitialData);

export const useLocale = () => {
  return useContext(LocaleContext);
};

export const _ = (
  key:
    | "Name"
    | "Position"
    | "ToolsTitle"
    | "YoutubeProjectTitle"
    | "YoutubeProjectDescription"
    | string
) => {
  const { Translations } = useLocale();
  return Translations[key];
};

export const LocaleProvider: React.FC = ({ children }) => {
  const [LocaleDetails, _setLocaleDetails] = useState<LocaleDataType>({
    ...InitialData,
    changeLocale: (newLanguage: keyof typeof validLocales) => {
      // prevents calling the already used language.
      console.log(LocaleDetails);
      //if (newLanguage == LocaleDetails.locale) { return; }

      _setLocaleDetails((prevData) => {
        return {
          ...prevData,
          busy: true,
        };
      });

      // uses in-memory english translation when called.
      if (newLanguage == "en") {
        _setLocaleDetails((prevData) => {
          return {
            ...InitialData,
            changeLocale: prevData.changeLocale,

            busy: false,
          };
        });
        return;
      }

      WebFetcher(`/locale/portifolio/${newLanguage}.json`)
        .then((response) => {
          _setLocaleDetails((prevData) => {
            return {
              ...prevData,
              locale: newLanguage,
              localeLong: validLocales[newLanguage],
              Translations: response,
              busy: false,
            };
          });
        })
        .catch((_error) => {
          console.error(_error);
          _setLocaleDetails(() => {
            return {
              ...InitialData,
              busy: false,
            };
          });
        });
    },
  });

  useEffect(() => {
    (async () => {
      const UserNavigatorLanguage = navigator.language.split("-")[0];
      if (UserNavigatorLanguage == "en") {
        return;
      }

      // if the user's language is different from the default locale, change it.
      if (UserNavigatorLanguage !== LocaleDetails.locale) {
        // check if the user's language is a valid locale
        if (validLocales[UserNavigatorLanguage as keyof typeof validLocales]) {
          WebFetcher("/locale/portifolio/" + UserNavigatorLanguage + ".json")
            .then((response) => {
              _setLocaleDetails((prevData) => {
                return {
                  ...prevData,
                  locale: UserNavigatorLanguage,
                  localeLong:
                    validLocales[
                      UserNavigatorLanguage as keyof typeof validLocales
                    ],
                  Translations: response,
                };
              });
            })
            .finally(() => {
              _setLocaleDetails((prevData) => {
                return {
                  ...prevData,
                  busy: false,
                };
              });
            });
        }
      }
    })();
  }, []);

  return (
    <LocaleContext.Provider value={LocaleDetails}>
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;
