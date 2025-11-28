import { useState, useEffect, useActionState } from "react";
import { Img } from "../../utiles";
import { Link } from "react-router";
import { useError } from "../Providers/ErrorProvider";
import { AiOutlineClose } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import Buffering from "../Buffering/Buffering";
import styles from "./Collections.module.css";
export default function Collections() {
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
        const res = await fetch("/api/collections/collections-list", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setCollections(data.collections);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Error in fetching Collection, please try later");
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
      <h1>My Collections</h1>
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
              />
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
            </form>
          ) : (
            <button onClick={() => setAddingCollection(true)}>
              <MdAdd />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
  async function createCollection(prevState, formData) {
    const name = formData.get("name");
    try {
      const res = await fetch("/api/collections/create", {
        method: "POST",
        body: JSON.stringify({ name }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCollections(data.Collections);
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
  const { setError } = useError();
  const [removing, setRemoving] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);
  if (!collection) return null;
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.close} onClick={closeModal}>
          <AiOutlineClose />
        </button>
        <h1>{collection.name}</h1>
        <ol>
          {collection.movies.map((movie) => (
            <li key={movie.id}>
              <Link to={`/movie/${movie.id}`}>
                <Img
                  src={movie.poster}
                  alt={movie.title}
                  size="w185"
                  className={styles.poster}
                />
                <h2>{movie.title}</h2>
                <button
                  disabled={removing}
                  onClick={() => removeMovie(movie.id, collection._id)}
                ></button>
              </Link>
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
      const res = await fetch("/api/collections/delete-movie", {
        method: "PATCH",
        body: JSON.stringify({ movie, collection }),
        credentials: "include",
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
  async function deleteCollection(collection){
    setDeleting(true);
    try{
      const res = await fetch("/api/collections/delete", {
        method: "DELETE",
        body: JSON.stringify({collection}),
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
