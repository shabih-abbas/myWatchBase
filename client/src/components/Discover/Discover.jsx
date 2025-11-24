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
  const [filters, setFilters] = useState(null);
  const { setError } = useError();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = searchParams.toString();
  const page = Number(searchParams.get("page")) || 1;
  
  useEffect(() => {
    async function fetchFilters() {
      try {
        const res = await fetch("/api/movies/filters");
        const data = await res.json();
        if (res.ok) {
          setFilters(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error in loading Filters");
      }
    }
    setError(null);
    fetchFilters();
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
          {filters ? filters.languages.map((lang) => (
            <option
              key={lang.iso_639_1}
              className={styles.option}
              value={lang.iso_639_1}
            >
              {lang.english_name}
            </option>
          )): null}
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
          {filters ? filters.genres.map((genre) => (
            <option key={genre.id} className={styles.option} value={genre.id}>
              {genre.name}
            </option>
          )): null}
        </select>
        <select className={styles.select} name="rating" id="rating" defaultValue="">
          <option disabled value="">
            Rating
          </option>
          {filters ? filters.ratings.map((rating) => (
            <option
              key={rating.value}
              className={styles.option}
              value={rating.value}
            >
              {rating.name}
            </option>
          )): null}
        </select>
        <select className={styles.select} name="release_date" id="release_date" defaultValue="">
          <option disabled value="">
            Release Date
          </option>
          {filters ? filters.releaseDate.map((date) => (
            <option
              key={date.value}
              className={styles.option}
              value={date.value}
            >
              {date.name}
            </option>
          )): null}
        </select>
        <select className={styles.select} name="sort" id="sort" defaultValue="">
          <option disabled value="">
            Sort
          </option>
          {filters ? filters.sort.map((opt) => (
            <option
              key={opt.value}
              className={styles.option}
              value={opt.value}
            >
              {opt.name}
            </option>
          )): null}
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
    const rating = formData.get("rating");
    const releaseDate = formData.get("release_date");
    const sort = formData.get("sort");
    if (lang) newParams["with_original_language"] = lang;
    if (genre) newParams["with_genres"] = genre;
    if (sort) newParams["sort_by"] = sort;
    if (releaseDate) newParams["primary_release_date.gte"] = releaseDate;
    if (rating) newParams["vote_average.gte"] = rating;
    setSearchParams(newParams);
  }
}
