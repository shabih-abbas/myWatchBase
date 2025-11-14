import { VscLoading } from 'react-icons/vsc';
import styles from './Buffering.module.css';
export default function Buffering(){
    return (
        <div className={styles.container}>
            <VscLoading aria-label='loading' className={styles.loader} />            
        </div>
    )
}