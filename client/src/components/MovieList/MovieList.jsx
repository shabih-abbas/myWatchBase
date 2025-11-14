import Movie from '../Movie/Movie';
import styles from './MovieList.module.css';
export default function MovieList({movies}){
    return (
        <div className={styles.container}>
            {movies.length > 0 ?
                movies.map(movie=>(
                    <Movie movie={movie} key={movie.id}/>
                ))
            : <p className={styles.empty}>Sorry, no movies available.</p>}
        </div>
    )
}