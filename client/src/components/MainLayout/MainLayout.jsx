import {Outlet, Link} from 'react-router'
import logo from '../../assets/dark.svg';
import styles from './MainLayout.module.css';
import Menu from '../Menu/Menu';

export default function MainLayout(){
    return (
        <>
            <header className= {styles.mainLayout}>
                <nav>
                    <Link className={styles.logo} to="/"><img src={logo} alt="logo" /></Link>
                    <Menu />
                </nav>  
            </header>  
            <Outlet/>
        </>
    )
}