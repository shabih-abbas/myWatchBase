import { Link } from 'react-router';
import { MdOutlineExplore } from "react-icons/md";
import ProfileIcon from '../ProfileIcon/ProfileIcon';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Menu.module.css';
export default function Menu(){
    return (
        <menu className={styles.menu}>
            <SearchBar />
            <Link to='/discover' className={styles.explore}>
                <MdOutlineExplore aria-label="explore" className={styles.icon} />
            </Link>
            <ProfileIcon />
        </menu>
    )
}