import styles from './LoginLayout.module.css'
import logo from '../../assets/dark.svg'
import { Link, Outlet } from 'react-router'

export default function LoginLayout(){
    return (
        <>
            <header className={styles.loginLayout}>
                <nav>
                    <Link to="/"><img src={logo} alt="logo" /></Link>
                </nav>
                <p>Let's find your next great watch!</p>
            </header>
            <Outlet/>
        </>
    )
}