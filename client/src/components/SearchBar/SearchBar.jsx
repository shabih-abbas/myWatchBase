import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import styles from "./SearchBar.module.css";
export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  return (
    <form className={styles.search} action={() => navigate(`/search?query=${query}&page=1`)}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
        type="text"
        name="query"
        className={styles.input}
      />
      <button
        className={styles.submit}
        aria-label="submit"
        type="submit"
        disabled={query === ""}
      >
        <FaSearch className={styles.iconSm} />
      </button>
    </form>
  );
}
