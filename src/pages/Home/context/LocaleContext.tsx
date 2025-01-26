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
  YoutubeProjectDescription: "<p>Clone do youtube</p>",
  YoutubeProjectTitleb: "",
  YoutubeProjectTitlec: "",
  YoutubeProjectTitled: "",
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
