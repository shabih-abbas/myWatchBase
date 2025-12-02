import { createContext, useContext, useState, useEffect } from "react";
import { useLoading } from "./LoadingProvider";

const AuthContext = createContext();

export function AuthProvider({children}){
    const API_URL = import.meta.env.VITE_API_URL || "";
    const {setLoading} = useLoading();
    const [user, setUser] = useState(null);
    
    useEffect(() =>{
        async function authenticate(){
            setLoading(true);
            try{
                const res = await fetch(API_URL+'/api/auth/authenticate', {credentials: 'include'});
                const data = await res.json();
                if(res.ok){
                    setUser(data.user)
                }
                else{
                    console.log(data.message);
                }
            }
            catch(err){
                console.warn('Error in authentication', err)
            }
            finally{
                setLoading(false);
            }
        }
        authenticate();
    } , [])
    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);