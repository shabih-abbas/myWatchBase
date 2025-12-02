import { useState, useEffect, useActionState } from "react";
import { Img } from "../../utiles";
import { Link } from "react-router";
import { useError } from "../Providers/ErrorProvider";
import { AiOutlineClose } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import Buffering from "../Buffering/Buffering";
import styles from "./Collections.module.css";
export default function Collections() {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [addingCollection, setAddingCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, formAction, isPending] = useActionState(
    createCollection,
    null
  );
  const { setError } = useError();
  useEffect(() => {
    async function fetchCollections() {
      setLoading(true);
      try {
        const res = await fetch(API_URL+"/api/collections/list", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setCollections(data.collections);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error in fetching Collection, please try later" + err.message);
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);
  if (loading) return <Buffering />;
  return (
    <div className={styles.container}>
      <h1 className={styles.mainHeading}>My Collections</h1>
      <div className={styles.collections}>
        {collections.map((collection) => (
          <button
            key={collection._id}
            className={styles.collection}
            onClick={() => setSelected(collection)}
          >
            {collection.name}
          </button>
        ))}
        <div className={styles.addNew}>
          {addingCollection ? (
            <form className={styles.form} action={formAction}>
              <input
                disabled={isPending}
                name="name"
                type="text"
                className={styles.input}
                required
                placeholder="Collection Name"
                maxLength="50"
              />
              <div className={styles.buttons}>
                <button
                  disabled={isPending}
                  className={styles.button}
                  type="submit"
                >
                  Add
                </button>
                <button
                  disabled={isPending}
                  className={styles.button}
                  onClick={() => setAddingCollection(false)}
                >
                  Cancel
                </button>
              </div>
              
            </form>
          ) : (
            <button className={styles.addNewBtn} onClick={() => setAddingCollection(true)}>
              <MdAdd className={styles.addIcon} />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>
      {selected ?
        <CollectionModal collection={selected} closeModal={() => setSelected(null)} updateCollections={updated => {
          setCollections(updated);
          setSelected(updated.find(collection => collection._id == selected._id));
          }} />
      : null}
    </div>
  );
  async function createCollection(prevState, formData) {
    const name = formData.get("name");
    try {
      const res = await fetch(API_URL+"/api/collections/create", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        setCollections(data.collections);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false };
      }
    } catch (err) {
      setError("Could'nt add collection" + err.message);
      return { success: false };
    } finally {
      setAddingCollection(false);
    }
  }
}

function CollectionModal({ collection, closeModal, updateCollections }) {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const { setError } = useError();
  const [removing, setRemoving] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.close} onClick={closeModal}>
          <AiOutlineClose className={styles.closeIcon} />
        </button>
        <h1 className={styles.modalHeading}>{collection.name}</h1>
        {collection.movies.length == 0 ? (
          <p className={styles.noMovies}>No movies in this collection</p>
        ) : null}
        <ol className={styles.movieList}>
          {collection.movies.map((movie, index) => (
            <li className={styles.listItem} key={movie.id}>
              <div className={styles.movieItem}>
                <p className={styles.index}>{index + 1}</p>
                <Link className={styles.movieInfo} to={`/movie/${movie.id}`}>
                  
                    <Img
                      path={movie.poster}
                      alt={movie.title}
                      size="w92"
                      className={styles.poster}
                    />
                    <h2 className={styles.movieTitle}>{movie.title}</h2>
                  </Link>  
                <button
                  className={styles.movieRemove}
                  disabled={removing}
                  onClick={() => removeMovie(movie.id, collection._id)}
                >Remove</button>
              
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.delete}>
          <button
            className={styles.deleteBtn}
            disabled={showDeleteConfirmation}
            onClick={() => setShowDeleteConfirmation(true)}
          >
            Delete Collection
          </button>
          {showDeleteConfirmation ? 
            <div className={styles.confirm}>
              <p>Are you sure you want to delete this collection?</p>
              <button disabled={deleting} className={styles.confirmYes} onClick={() => deleteCollection(collection._id)}>Yes</button>
              <button disabled={deleting} className={styles.confirmNo} onClick={() => setShowDeleteConfirmation(false)}>No</button>
            </div>
          : null}
        </div>
      </div>
    </div>
  );
  async function removeMovie(movie, collection) {
    setRemoving(true);
    try {
      const res = await fetch(API_URL+"/api/collections/delete-movie", {
        method: "PATCH",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movie, collection }),
      });
      const data = await res.json();
      if (res.ok) {
        updateCollections(data.collections);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Could'nt remove movie" + err.message);
    } finally {
      setRemoving(false);
    }
  }
  async function deleteCollection(collectionId){
    setDeleting(true);
    try{
      const res = await fetch(API_URL+"/api/collections/delete/" + collectionId, {
        method: "DELETE",
        credentials: 'include'
      });
      const data = await res.json();
      if(res.ok){
        updateCollections(data.collections);
      }
      else{
        setError(data.message);
      }
    }
    catch(err){
      setError("Could'nt delete collection" + err.message);
    }
    finally{
      setDeleting(false)
      closeModal();
    }
  }

}
