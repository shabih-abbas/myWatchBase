import { useState } from "react";
import styles from "./Tooltip.module.css";
export default function Tooltip({children, label}){
    const[show, setShow] = useState(false);
    return (
        <div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)} className={styles.container}>
            <p aria-hidden hidden={!show} className={styles.tooltip}>{label}</p>
            {children}
        </div>
    )
}