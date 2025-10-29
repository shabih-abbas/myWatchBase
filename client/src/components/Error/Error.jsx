import styles from './Error.module.css'
export default function Error({message}){
    return (
        <div className={styles.container}>
            <div className={styles.error}>
                <p className={styles.text}>{message}</p>
            </div>
        </div>
    )
}