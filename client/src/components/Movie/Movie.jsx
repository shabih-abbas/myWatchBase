import { Link } from 'react-router';
import styles from './Movie.module.css';
import {formatDate} from '../../utiles';
import StarRating from '../StarRating/StarRating';
import { Img } from '../../utiles';

export default function Movie({movie}) {
    return (
        <Link to={`/movie/${movie.id}`}>
            <div className={styles.movie}>
                <div className={styles.posterCtn}>
                    <Img path={movie.poster} alt={movie.title+ ' poster'} size='w500' />
                </div>
                <h3>{movie.title}</h3>
                <div className={styles.details}>
                    <p>{formatDate(movie.releaseDate)}</p>
                    <StarRating rating={movie.rating}/>
                </div>
            </div>
        </Link>
    );
}
