import { useState, useEffect } from "react";
import styles from "./AddToCollection.module.css";
export default function AddToCollection({ movie }) {
  const [collections, setCollections] = useState([]);
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
      try {
        const res = await fetch("/api/collections/collections-list", {
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
    }
    if(showCollections)
        getCollections();
  }, [showCollections]);
  return (
    <div className={styles.container}>
      <button
        className={styles.mainBtn}
        onClick={() => setShowCollections((prev) => !prev)}
      >
        Add to Collection
      </button>
      {showCollections ? (
        <div className="collections">
          {errorMessage ? (
            <p className={styles.error}>{errorMessage}</p>
          ) : (
            <ul>
              {collections.map((collection) => {
                if (alreadyAddedIn.includes(collection._id)) return null;
                return (
                  <li key={collection._id} className={styles.collection}>
                    <button
                      disabled={adding}
                      className={styles.addBtn}
                      onClick={() => addMovie(movie.id, collection._id)}
                    >
                      {collection.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
  async function addMovie(movie, collection) {
    setAdding(true);
    try {
      const res = await fetch("/api/collections/add-movie", {
        method: "PATCH",
        body: JSON.stringify({ movie, collection }),
        credentials: "include",
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
