import { FaRegUser } from "react-icons/fa";
import { BiCollection } from "react-icons/bi";
import { PiSignOut } from "react-icons/pi";
import { PiSignIn } from 'react-icons/pi';
import styles from "./ProfileIcon.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoading } from "../Providers/LoadingProvider";
import { useError } from "../Providers/ErrorProvider";
import { useAuth } from "../Providers/AuthProvider";
import Tooltip from "../Tooltip/Tooltip";
export default function ProfileIcon() {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const Navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { setLoading } = useLoading();
  const { setError } = useError();
  const [active, setActive] = useState(false);
  async function logout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(API_URL+"/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        Navigate("/");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Could not perform logout, please try later.");
      console.error("Logout Error", err);
    } finally {
      setLoading(false);
    }
  }
  return user == null ? (
    <Tooltip label="Login">
      <Link className={styles.link} to="/login" aria-label="login">
        <PiSignIn className={styles.icon} />
      </Link>
    </Tooltip>
  ) : (
    <div className={styles.container}>
       <Tooltip label="My Profile">
        <button
          className={styles.profile}
          onClick={() => setActive((prev) => !prev)}
        >
          <FaRegUser className={styles.icon} />
        </button>
      </Tooltip>
      {active ? (
        <ul className={styles.dropdown}>
          <li>
            <Tooltip label="My Collections">
              <Link className={styles.link} aria-label="My collections" to="/collections">
                <BiCollection className={styles.icon} />
              </Link>
            </Tooltip>
          </li>
          <li>
            <Tooltip label="Logout">
              <button aria-label="Logout" onClick={() => logout()}>
                <PiSignOut className={styles.icon} />
              </button>
            </Tooltip>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
