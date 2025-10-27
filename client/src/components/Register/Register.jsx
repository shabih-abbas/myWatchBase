import styles from './Register.module.css'
import { Link } from 'react-router'
export default function Register(){
    return(
        <main className={styles.register}>
            <form action="">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required/>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" minLength='5' required/>
                <button>Register</button>
            </form>
            <Link to='/login'>already have an account</Link>
        </main>
    )
}