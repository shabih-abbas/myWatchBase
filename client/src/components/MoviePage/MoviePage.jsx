import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useError } from "../Providers/ErrorProvider";
import { formatDate } from "../../utiles";
import styles from "./MoviePage.module.css";
import imdb from "../../assets/imdb.png";
import rottenTomatoes from "../../assets/rotten_tomatoes.png";
import metaCritic from "../../assets/metacritic.png";

export default function MoviePage() {
  const [movie, setMovie] = useState(null);
  const params = useParams();
  const { setError } = useError();
  const baseImgUrl = "https://image.tmdb.org/t/p/";
  useEffect(() => {
    async function getMovie(id) {
      setError(null);
      try {
        const res = await fetch(`/api/movies/movie?id=${id}`);
        const data = await res.json();
        if (res.ok) {
          setMovie(data.movie);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Unable to fetch details, Please try later");
        console.warn("Error in fetching movie details ", err);
      }
    }
    getMovie(params.id);
  }, []);
  const ratingLogos = {
    "Internet Movie Database": imdb,
    "Rotten Tomatoes": rottenTomatoes,
    Metacritic: metaCritic,
  };
  return (
    <main className={styles.container}>
      {movie == null ? (
        "Loading..."
      ) : (
        <>
          <Back />
          <div className={styles.backdropCtn}>
            <img
              className={styles.backdrop}
              src={`${baseImgUrl}w780/${movie.backdrop_path}`}
              alt={movie.title + " backdrop"}
            />
            <div className={styles.backdropOverlay}></div>
          </div>
          <div className={styles.movie}>
            <img
              className={styles.poster}
              src={`${baseImgUrl}w500/${movie.poster_path}`}
              alt=""
            />
            <div className={styles.details}>
              <h1>{movie.title}</h1>
              <p>{formatDate(movie.release_date)}</p>
              <ul className={styles.genrelist}>
                {movie.genres.map((genre) => (
                  <li className={styles.genre} key={genre.id}>
                    {genre.name}
                  </li>
                ))}
              </ul>
              <p>{movie.overview}</p>
              {movie.ratings ? (
                <ul className={styles.ratinglist}>
                  {movie.ratings.map((rating) => (
                    <li className={styles.rating}>
                      <img
                        src={ratingLogos[rating.Source]}
                        alt={ratingLogos[rating.Source]}
                      />
                      <span>{rating.Value}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
function Back() {
  const Navigate = useNavigate();
  return (
    <button className={styles.back} onClick={() => Navigate(-1)}>
      <span className={styles.backarrow}>←</span>
      back
    </button>
  );
}
