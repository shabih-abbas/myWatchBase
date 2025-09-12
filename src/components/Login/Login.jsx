import styles from './Login.module.css'
import { Link } from 'react-router'

export default function Login(){
    return (
        <main className={styles.login}>
            <form action="">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required/>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" required/>
                <button>Login</button>
            </form>
            <Link to='/register'>or create a new account</Link>
        </main>
    )
}