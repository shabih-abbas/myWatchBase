import {Outlet, Link} from 'react-router'
import { FaSearch } from 'react-icons/fa';
import { PiSignIn } from 'react-icons/pi';
import logo from '../../assets/dark.svg';
import styles from './MainLayout.module.css';
import {useAuth} from '../Providers/AuthProvider';
import ProfileIcon from '../ProfileIcon/ProfileIcon';

export default function MainLayout(){
    const {user} = useAuth();
    return (
        <>
            <header className= {styles.mainLayout}>
                <nav>
                    <Link to="/"><img src={logo} alt="logo" /></Link>
                    <menu>
                        <Link to="browse" aria-label='browse movies'><FaSearch className={styles.icon}/></Link>
                        {
                            user != null ?
                            <ProfileIcon /> :
                            <Link to="login" aria-label='login'><PiSignIn className={styles.icon}/></Link>
                        }
                        
                    </menu>
                </nav>  
            </header>  
            <Outlet/>
        </>
    )
}