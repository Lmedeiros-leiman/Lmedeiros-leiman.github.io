import { createContext } from "preact";
import { useState } from "preact/hooks";


export const LocaleContext = createContext({});


export const LocaleProvider : React.FC = ({children}) => {

    const [LocaleDetails, _setLocaleDetails] = useState({ 
        busy: true 
    });

    return (
        <LocaleContext.Provider value={LocaleDetails}>
            {children}
        </LocaleContext.Provider>
    );
}


export default LocaleProvider;