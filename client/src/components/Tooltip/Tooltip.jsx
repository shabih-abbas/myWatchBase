import { useState } from "react";
import styles from "./Tooltip.module.css";
export default function Tooltip({children, label}){
    const[show, setShow] = useState(false);
    return (
        <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)} aria-hidden className={styles.container}>
            <p hidden={!show} className={styles.tooltip}>{label}</p>
            {children}
        </div>
    )
}