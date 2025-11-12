import { FaRegUser } from 'react-icons/fa';
import { BiCollection } from 'react-icons/bi';
import { PiSignOut } from 'react-icons/pi';
import styles from './ProfileIcon.module.css'
import {useState} from 'react';
import {Link} from 'react-router';
import { useLoading } from '../Providers/LoadingProvider';
import { useError } from '../Providers/ErrorProvider';
import {useAuth} from '../Providers/AuthProvider';

export default function ProfileIcon(){
    const {setUser} = useAuth();
    const {setLoading} = useLoading();
    const {setError} = useError();
    const [active, setActive] = useState(false);
    async function logout(){
        setError(null);
        setLoading(true);
        try{
            const res= await fetch("/api/auth/logout", {
                method: 'POST',
                credentials: 'include',
            })
            if(res.ok){
                setUser(null);
            }
        }
        catch(err){
            setError("Could not perform logout, please try later.")
            console.error("Logout Error", err)
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <div className={styles.container}>
            <button className={styles.profile} onClick={()=> setActive(prev=> !prev)}><FaRegUser className={styles.icon} /></button>
            {active ?
            <ul className={styles.dropdown}>
                <li><Link aria-label='My collections' to='collections'><BiCollection className={styles.icon}/></Link></li>
                <li><button aria-label='Logout' onClick={() => logout()}><PiSignOut className={styles.icon}/></button></li>
            </ul>
            : null}
        </div>
    )
}