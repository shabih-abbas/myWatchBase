import {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import { useError } from '../Providers/ErrorProvider';
import Buffering from '../Buffering/Buffering';
import MovieList from '../MovieList/MovieList';
import styles from './Search.module.css';
export default function Search(){
    const {query} = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setError} = useError();
    useEffect(() => {
        async function fetchResults(query) {
            setLoading(true);
            setError(null);
            try{
                const res = await fetch(`/api/movies/search?query=${query}`);
                const data = await res.json();
                if(res.ok){
                    setResults(data.movies);
                }
                else{
                    setError(data.message);
                }
            }
        catch(err){
            setError("Error fetching movies, Please try later.")
        }
        finally{
            setLoading(false);
        }

        }
        fetchResults(query);
    }, [query]);
    return loading ? 
        <Buffering />
    :
        (
            <div className={styles.container}>
                <h1>{`Results for "${query}"`}</h1>
                <MovieList movies={results} />
            </div>
        )
}