import styles from './StarRating.module.css';
export default function StarRating({rating}){
    return(
        <div className={styles.container}>
            <p>{Math.round(rating*10)/10}</p>
            <div className={styles.star}>
                <p className={styles.unfilled}>{'★'.repeat(5)}</p>
                <p className={styles.filled} style={{width: `${Math.round(rating*10)}%`}}>{'★'.repeat(5)}</p>
            </div>        
        </div>
    );
}