import styles from './StarRating.module.css';
export default function StarRating({rating}){
    return(
        <div className={styles.container}>
            <p>{Math.round(rating*10)/10}</p>
            <div className={styles.star}>
                <p className={styles.unfilled}>★</p>
                <p className={styles.filled} style={{width: `${Math.round(rating*10)}%`}}>★</p>
            </div>        
        </div>
    );
}