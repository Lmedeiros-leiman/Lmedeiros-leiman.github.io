import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { WebFetcher } from "../../../libs/WebFetcher";


export type TranslationKeys = {
    "Name": string,
    "Position": string,
    "ToolsTitle": string,
    "ProjectsTitle": string,
}

export type LocaleDataType = {
    busy: boolean,
    locale: string,
    localeLong: string,
    Translations: Record<string, string>,
    changeLocale : (newLanguage : keyof (typeof validLocales)) => void

}

export const validLocales = {
    "en": "🇺🇸 En-US",
    "pt": "🇧🇷 Pt-BR",
}

const InitialData: LocaleDataType = {
    busy: true,
    locale: "en",
    localeLong: validLocales["en"],
    Translations: {
        "Name": "Leonardo Medeiros Leiman",
        "Position": "Full Stack Developer",
        "ToolsTitle": "My favorite tools",
        "ProjectsTitle": "Projects & Experiences"
    },
    changeLocale : () => {return}
}


const LocaleContext = createContext<LocaleDataType>(InitialData);

export const useLocale = () => {
    return useContext(LocaleContext)
}

export const _ = (
    key: "Name" | "Position" | "ToolsTitle" | "ProjectsTitle" | string
) => {
    const { Translations } = useLocale();
    return Translations[key];
}


export const LocaleProvider: React.FC = ({ children }) => {


    const [LocaleDetails, _setLocaleDetails] = useState<LocaleDataType>({
        ...InitialData,
        changeLocale: (newLanguage : keyof (typeof validLocales)) => {

            _setLocaleDetails((prevData) => {
                return {
                ...prevData,
                busy: true,
                }
            });

            WebFetcher("/locale/portifolio/" + newLanguage + ".json")
            .then( (response) => {
                _setLocaleDetails((prevData) => {
                    return {
                        ...prevData,
                        locale: newLanguage,
                        localeLong: validLocales[newLanguage],
                        Translations: response,
                    }
                });
            })
            .finally( () => {

                _setLocaleDetails((prevData) => {
                    return {
                    ...prevData,
                    busy: false,
                    }
                });
            })

        }
    });

    useEffect(() => {
        const UserNavigatorLanguage = navigator.language.split("-")[0];

        // if the user's language is different from the default locale, change it.
        if (UserNavigatorLanguage !== LocaleDetails.locale) {
            // check if the user's language is a valid locale
            if (validLocales[UserNavigatorLanguage as keyof typeof validLocales]) {
                WebFetcher("/locale/portifolio/" + UserNavigatorLanguage + ".json")
                    .then(response => {

                        _setLocaleDetails((prevData) => {
                            return {
                                ...prevData,
                                locale: UserNavigatorLanguage,
                                localeLong: validLocales[UserNavigatorLanguage as keyof typeof validLocales],
                                Translations: response,
                            }
                        });
                    })
                    .finally(() => {
                        _setLocaleDetails((prevData) => {
                            return {
                                ...prevData,
                                busy: false,
                            }
                        });
                    });
            }
        }

    }, [])




    return (
        <LocaleContext.Provider value={LocaleDetails}>
            {children}
        </LocaleContext.Provider>
    );
}


export default LocaleProvider;