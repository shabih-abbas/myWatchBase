import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useError } from "../Providers/ErrorProvider";
import { formatDate } from "../../utiles";
import Buffering from "../Buffering/Buffering";
import MovieCredits from "../MovieCredits/MovieCredits";
import MovieList from "../MovieList/MovieList";
import AddToCollection from "../AddToCollection/AddToCollection";
import styles from "./MoviePage.module.css";
import imdb from "../../assets/imdb.png";
import rottenTomatoes from "../../assets/rotten_tomatoes.png";
import metaCritic from "../../assets/metacritic.png";
import tmdb from "../../assets/tmdb.png";

export default function MoviePage() {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const [movie, setMovie] = useState(null);
  const { id } = useParams();
  const { setError } = useError();
  const baseImgUrl = "https://image.tmdb.org/t/p/";
  useEffect(() => {
    async function getMovie(id) {
      setMovie(null);
      setError(null);
      try {
        const res = await fetch(API_URL+`/api/movies/movie?id=${id}`);
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
    getMovie(id);
  }, [id]);
  const ratingLogos = {
    "Internet Movie Database": imdb,
    "Rotten Tomatoes": rottenTomatoes,
    Metacritic: metaCritic,
  };
  return (
    <main className={styles.container}>
      <Back />
      {movie == null ? (
        <Buffering />
      ) : (
        <>
          <div className={styles.backdropCtn}>
            <img
              className={styles.backdrop}
              src={`${baseImgUrl}w780/${movie.backdrop}`}
              alt={movie.title + " backdrop"}
            />
            <div className={styles.backdropOverlay}></div>
          </div>
          <div className={styles.movie}>
            <img
              className={styles.poster}
              src={`${baseImgUrl}w500/${movie.poster}`}
              alt=""
            />
            <div className={styles.details}>
              <h1>{movie.title}</h1>
              <p>{formatDate(movie.releaseDate)}</p>
              <ul className={styles.genrelist}>
                {movie.genres.map((genre) => (
                  <li className={styles.genre} key={genre.id}>
                    {genre.name}
                  </li>
                ))}
              </ul>
              <p>{movie.synopsis}</p>
              <p>{`Runtime: ${movie.runtime} mins`}</p>
              <p>{`Language${
                movie.languages.length > 1 ? "s" : ""
              }: ${movie.languages.join(", ")}`}</p>
              <ul className={styles.ratinglist}>
                <li className={styles.rating}>
                  <img src={tmdb} alt="tmdb" />
                  <span>{Math.round(movie.rating * 10) / 10}</span>
                </li>
                {movie.externalRatings
                  ? movie.externalRatings.map((rating) => (
                      <li key={rating.Source} className={styles.rating}>
                        <img
                          src={ratingLogos[rating.Source]}
                          alt={rating.Source}
                        />
                        <span>{rating.Value}</span>
                      </li>
                    ))
                  : null}
              </ul>
              <AddToCollection movie={movie} />
            </div>
          </div>
          <MovieCredits
            actors={movie.credits.actors}
            directors={movie.credits.directors}
            writers={movie.credits.writers}
          />
          <h2 className={styles.similarHeading}>Similar Movies</h2>
          <MovieList movies={movie.similar} />
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
