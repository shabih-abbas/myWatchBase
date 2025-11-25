import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useError } from "../Providers/ErrorProvider";
import Buffering from "../Buffering/Buffering";
import MovieList from "../MovieList/MovieList";
import Pagination from "../Pagination/Pagination";
import styles from "./Search.module.css";
export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const { setError } = useError();
  const query = searchParams.get('query') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  
  useEffect(() => {
    async function fetchResults(query, page) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`
        );
        const data = await res.json();
        if (res.ok) {
          setResults(data.movies);
          setTotalPages(data.totalPages);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error fetching movies, Please try later.");
      } finally {
        setLoading(false);
      }
    }
    fetchResults(query, page);
  }, [query, page]);
  return loading ? (
    <Buffering />
  ) : (
    <div className={styles.container}>
      <div className={styles.results}>
        <h1>{`Results for "${query}"`}</h1>
        <MovieList movies={results} />
      </div>
      <div className={styles.pagination}>
        <Pagination
          isFirst={page <= 1}
          isLast={page >= totalPages}
          nextPage={() =>
            setSearchParams((prev) => {
              if(page < totalPages){
                prev.set('page', page + 1);
              }
              return prev;
            })
          }
          prevPage={() => setSearchParams((prev) => {
            if(page > 1)
              prev.set('page', page - 1);
            return prev;
          })}
        />
      </div>
    </div>
  );
}
