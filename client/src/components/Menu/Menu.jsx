import {useState} from 'react';
import { Link, useNavigate } from 'react-router';
import { MdOutlineExplore } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import { useAuth } from '../Providers/AuthProvider';
import { useLoading } from '../Providers/LoadingProvider';
import { useError } from '../Providers/ErrorProvider';
import ProfileIcon from '../ProfileIcon/ProfileIcon';
import SearchBar from '../SearchBar/SearchBar';
import Tooltip from '../Tooltip/Tooltip';
import styles from './Menu.module.css';
export default function Menu(){
    const [show, setShow] = useState(false);
    const {user, setUser} = useAuth();
    const {setLoading} = useLoading();
    const {setError} = useError();
    const Navigate = useNavigate();
    return (
        <menu className={styles.menu}>
            <SearchBar />
            <div className={styles.lg}>
                <Tooltip label="Discover Movies">
                    <Link to='/discover' className={styles.explore}>
                        <MdOutlineExplore aria-label="explore" className={styles.icon} />
                    </Link>
                </Tooltip>
                <ProfileIcon />
            </div>
            <div className={styles.sm}>
                <TiThMenu onClick={() => setShow((prev) => !prev)} className={styles.icon} />
                {show ? (
                    <div className={styles.dropdown}>
                        <Link to='/discover' className={styles.link}>Discover</Link>
                        {user ? (
                            <>
                                <Link to='/collections' className={styles.link}>Collections</Link>
                                <button onClick={logout} className={styles.logout}>Logout</button>
                            </>
                        ): <Link to='/login' className={styles.link}>Login</Link>}
                        


                    </div>
                ): null}
            </div>
            
        </menu>
    )
    async function logout() {
        setError(null);
        setLoading(true);
        try {
          const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          if (res.ok) {
            setUser(null);
            Navigate("/");
          } else {
            const data = await res.json();
            setError(data.message);
          }
        } catch (err) {
          setError("Could not perform logout, please try later.");
          console.error("Logout Error", err);
        } finally {
          setLoading(false);
          setShow(false);
        }
      }
}