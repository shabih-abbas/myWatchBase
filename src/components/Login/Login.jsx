import styles from './Login.module.css'
import logo from '../../assets/dark.svg'
import { Link } from 'react-router'

export default function Login(){
    return (
        <header>
            <nav>
                <Link to="/"><img src={logo} alt="logo" /></Link>
            </nav>
            <main>

            </main>
        </header>
    )
}