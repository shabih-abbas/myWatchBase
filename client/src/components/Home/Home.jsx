import {useState, useEffect} from 'react';
import {useError} from '../Providers/ErrorProvider';
import styles from './Home.module.css';
import MovieList from '../MovieList/MovieList';
import Buffering from '../Buffering/Buffering';
export default function Home(){
    const [trending, setTrending] = useState(null);
    const {setError} = useError();
    useEffect(()=>{
        async function fetchTrending(){
            setError(null);
            try{
                const res = await fetch('/api/movies/trending');
                const data = await res.json();
                if(res.ok){
                    setTrending(data.movies);
                }
                else{
                    setError("Could not fetch trending movies.")
                    console.warn("Couldn't fetch trending", data.message);
                }
            }
            catch(err){
                setError("Error in loading trending movies.")
                console.error("Error in loading trending movies. ", err)
            }
        }
        fetchTrending();
    }, [])
    return (
        <>
            <h2 className={styles.heading}>Trending this week</h2>
            { trending ? 
                <MovieList movies={trending} />
                :
                <Buffering />
            }
        </>
    );
}