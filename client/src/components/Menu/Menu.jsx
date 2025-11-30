import { Link } from 'react-router';
import { MdOutlineExplore } from "react-icons/md";
import ProfileIcon from '../ProfileIcon/ProfileIcon';
import SearchBar from '../SearchBar/SearchBar';
import Tooltip from '../Tooltip/Tooltip';
import styles from './Menu.module.css';
export default function Menu(){
    return (
        <menu className={styles.menu}>
            <SearchBar />
            <Tooltip label="Explore Movies">
                <Link to='/discover' className={styles.explore}>
                    <MdOutlineExplore aria-label="explore" className={styles.icon} />
                </Link>
            </Tooltip>
            <ProfileIcon />
        </menu>
    )
}