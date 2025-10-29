import styles from './Login.module.css'
import { Link } from 'react-router'
import { useNavigate } from 'react-router';
import { useAuth } from '../Providers/AuthProvider';
import { useLoading } from '../Providers/LoadingProvider';
import { useError } from '../Providers/ErrorProvider';

export default function Login(){
    const {setUser} = useAuth();
    const {setLoading} = useLoading();
    const {setError} = useError();
    const Navigate = useNavigate();
    async function login(email, password){
        setLoading(true);
        try{
            const res = await fetch('/api/auth/login', {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            })
            const data = await res.json()
            if(res.ok){
                setUser(data.user);
                Navigate('/');
            }
            else{
                setError(data.message)
            }
        }
        catch(err){
            setError("Unable to login, please try later. " + err)
            console.error('error in login', err)
        }
        finally{
            setLoading(false);
        }
    }
    function handleSubmit(formData){
        var email = formData.get("email");
        var password = formData.get("password");
        login(email, password);
    }
    return (
        <main className={styles.login}>
            <form action={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input name="email" id="email" type="email" required/>
                <label htmlFor="password">Password</label>
                <input name='password' id="password" type="password" required/>
                <button type='submit'>Login</button>
            </form>
            <Link to='/register'>or create a new account</Link>
        </main>
    )
}