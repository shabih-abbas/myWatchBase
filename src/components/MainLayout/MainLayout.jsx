import {Outlet, Link} from 'react-router'
import logo from '../../assets/dark.svg';
import styles from './MainLayout.module.css';

export default function MainLayout(){
    return (
        <>
            <header className= {styles.mainLayout}>
                <nav>
                    <Link to="/"><img src={logo} alt="logo" /></Link>
                    <menu>
                        <Link to="browse">Browse</Link>
                        <Link to="login">Login</Link>
                    </menu>
                </nav>  
            </header>  
            <Outlet/>
        </>
    )
}