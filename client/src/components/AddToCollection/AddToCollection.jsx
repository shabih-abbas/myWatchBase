import { useState, useEffect } from "react";
import {Link} from 'react-router';
import styles from "./AddToCollection.module.css";
export default function AddToCollection({ movie }) {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCollections, setShowCollections] = useState(false);
  const [adding, setAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const alreadyAddedIn = collections
    .filter(
      (collection) =>
        collection.movies.find((mov) => mov.id == movie.id) != undefined
    )
    .map((collection) => collection._id);

  useEffect(() => {
    async function getCollections() {
      setLoading(true);
      try {
        const res = await fetch(API_URL+"/api/collections/list", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setCollections(data.collections);
        } else {
          setErrorMessage(data.message);
        }
      } catch (err) {
        setErrorMessage("Error in loading collections" + err.message);
      }
      finally{
        setLoading(false);
      }
    }
    getCollections();
  }, []);
  return (
    <div className={styles.container}>
      <button
        className={styles.mainBtn}
        onClick={() => setShowCollections((prev) => !prev)}
      >
        Add to Collection
      </button>
      {!loading && showCollections ? (
        <div className={styles.collections}>
          {errorMessage ? (
            <p className={styles.error}>{errorMessage}</p>
          ) : (
            <ul className={styles.collectionList}>
              {collections.map((collection) => {
                if (alreadyAddedIn.includes(collection._id)) return null;
                return (
                  <li key={collection._id} className={styles.collection}>
                    <button
                      disabled={adding}
                      className={styles.addBtn}
                      onClick={() => addMovie(movie, collection._id)}
                    >
                      {collection.name}
                    </button>
                  </li>
                );
              })}
              <li className={styles.newLink}><Link to='/collections'>Create New Collection</Link></li>
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
  async function addMovie(movie, collection) {
    setAdding(true);
    try {
      const res = await fetch(API_URL+"/api/collections/add-movie", {
        method: "PATCH",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movie, collection })
      });
      const data = await res.json();
      if (res.ok) {
        setCollections(data.collections);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage("Error in adding movie" + err.message);
    } finally {
      setAdding(false);
    }
  }
}
