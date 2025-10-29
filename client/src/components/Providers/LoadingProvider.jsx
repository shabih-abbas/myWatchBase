import {createContext, useContext, useState} from 'react';
import Loader from '../Loader/Loader';
const LoadingContext = createContext();

export function LoadingProvider({children}){
    const [loading, setLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{loading, setLoading}}>
            {loading ? <Loader /> : null}
            {children}
        </LoadingContext.Provider>
    )
}
export const useLoading = () => useContext(LoadingContext);