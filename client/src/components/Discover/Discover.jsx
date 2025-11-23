import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useError } from "../Providers/ErrorProvider";
import Buffering from "../Buffering/Buffering";
import MovieList from "../MovieList/MovieList";
import Pagination from "../Pagination/Pagination";
import styles from "./Discover.module.css";

export default function Discover() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const { setError } = useError();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = searchParams.toString();
  const page = Number(searchParams.get("page")) || 1;
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const res = await fetch("/api/movies/languages");
        const data = await res.json();
        if (res.ok) {
          setLanguages(data.languages);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error in loading languages");
      }
    }
    async function fetchGenres() {
      try {
        const res = await fetch("/api/movies/genres");
        const data = await res.json();
        if (res.ok) {
          setGenres(data.genres);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error in loading genres");
      }
    }
    setError(null);
    fetchGenres();
    fetchLanguages();
  }, []);
  useEffect(() => {
    async function fetchResults(params) {
      setLoading(true);
      try {
        const res = await fetch("/api/movies/discover?" + params);
        const data = await res.json();
        if (res.ok) {
          setResults(data.movies);
          setTotalPages(data.totalPages);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Could'nt fetch movies, Please try later");
      } finally {
        setLoading(false);
      }
    }
    setError(null);
    fetchResults(params);
  }, [params]);

  return (
    <div className={styles.container}>
      <form
        className={styles.filters}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          setParams(formData);
        }}
      >
        <select className={styles.select} name="lang" id="lang" defaultValue="">
          <option disabled value="">
            Language
          </option>
          {languages.map((lang) => (
            <option
              key={lang.iso_639_1}
              className={styles.option}
              value={lang.iso_639_1}
            >
              {lang.english_name}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          name="genre"
          id="genre"
          defaultValue=""
        >
          <option disabled value="">
            Genre
          </option>
          {genres.map((genre) => (
            <option key={genre.id} className={styles.option} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <button className={styles.submit} type="submit">
          Filter
        </button>
      </form>
      {loading ? (
        <Buffering />
      ) : (
        <>
          <MovieList movies={results} />
          <Pagination
            isFirst={page <= 1}
            isLast={page >= totalPages}
            nextPage={() => {
              setSearchParams((prev) => {
                if (page < totalPages) prev.set("page", page + 1);
                return prev;
              });
            }}
            prevPage={() => {
              setSearchParams((prev) => {
                if (page > 1) prev.set("page", page - 1);
                return prev;
              });
            }}
          />
        </>
      )}
    </div>
  );
  function setParams(formData) {
    const newParams = { page: 1 };
    const lang = formData.get("lang");
    const genre = formData.get("genre");
    if (lang) newParams["with_original_language"] = lang;
    if (genre) newParams["with_genres"] = genre;
    setSearchParams(newParams);
  }
}
