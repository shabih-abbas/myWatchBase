import {Outlet, Link} from 'react-router'
import logo from '../../assets/dark.svg';
import tmdb from '../../assets/tmdb.png';
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
            <footer className={styles.footer}>
                <div className={styles.footerBrand}>
                    <img src={logo} alt="logo" className={styles.footerLogo}/>
                    <address><em>Made with ❤️ by </em><a target="_blank" href="mailto:shabihabbas09@gmail.com">Shabih Abbas</a></address>
                    <p>© 2025</p>    
                
                    <div className={styles.footerLinks}>
                        <a target="_blank" href="https://github.com/shabih-abbas/myWatchBase">Github</a>
                        <a target="_blank" href="https://www.linkedin.com/in/shabih-abbas-826b35232/">Linkdin</a>
                    </div>
                </div>
                <div className={styles.attributions}>
                    <p className={styles.tmdbText}><img className={styles.tmdb} src={tmdb} alt="tmdb logo" /> <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span> </p>
                    <p>Data from OMDb</p>
                    <p>This is a demonstration project. No personal data is sold or shared. Cookies are used strictly for authentication purposes.</p>
                </div>
            </footer>
        </>
    )
}