import { Link } from 'react-router';
import styles from './Movie.module.css';
import {formatDate} from '../../utiles';
import StarRating from '../StarRating/StarRating';

export default function Movie({movie}) {
    const baseImgPath = "https://image.tmdb.org/t/p/w500"
    
    return (
        <Link to={`movie/${movie.id}`}>
            <div className={styles.movie}>
                <div className={styles.posterCtn}>
                    <img src={baseImgPath + movie.poster_path} alt={movie.title+ ' poster'}/>
                </div>
                <h3>{movie.title}</h3>
                <div className={styles.details}>
                    <p>{formatDate(movie.release_date)}</p>
                    <StarRating rating={movie.vote_average}/>
                </div>
            </div>
        </Link>
    );
}
