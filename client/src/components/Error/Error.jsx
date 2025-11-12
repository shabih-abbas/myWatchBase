import styles from './Error.module.css'
export default function Error({message, closeHandler}){
    return (
        <div className={styles.container}>
            <div className={styles.error}>
                <p className={styles.text}>{message}</p>
                <button onClick={ closeHandler } className={styles.close}>&times;</button>
            </div>
        </div>
    )
}
