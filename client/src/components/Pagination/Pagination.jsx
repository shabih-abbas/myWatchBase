import { FcPrevious } from 'react-icons/fc';
import { FcNext } from 'react-icons/fc';
import styles from "./Pagination.module.css";
export default function Pagination({ isFirst, isLast, nextPage, prevPage }) {
  return (
    <div className={styles.container}>
      <button
        className={styles.prev}
        disabled={isFirst}
        onClick={prevPage}
      >
        <FcPrevious />
      </button>
      <button
        className={styles.next}
        disabled={isLast}
        onClick={nextPage}
      >
        <FcNext />
      </button>
    </div>
  );
}
