import { createContext , useContext, useState } from "react";
import Error from '../Error/Error'

const ErrorContext = createContext();

export function ErrorProvider({children}){
    const [error, setError] = useState(null);

    return (
        <ErrorContext.Provider value= {{error, setError}}>
            {error ? <Error message={error} closeHandler={() => setError(null)} /> : null}
            {children}
        </ErrorContext.Provider>
    )
}
export const useError = () => useContext(ErrorContext);