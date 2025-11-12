import styles from './Register.module.css'
import { Link } from 'react-router'
import {useLoading} from '../Providers/LoadingProvider';
import {useError} from '../Providers/ErrorProvider';
import { useState } from 'react';
export default function Register(){
    const {setLoading} = useLoading();
    const {setError} = useError();
    const [success, setSuccess] = useState(false);
    async function register(email, password, confirm){
        setError(null);
        if(password === confirm){
            setLoading(true);
            try{
                const res = await fetch('/api/auth/register', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email, password}),
                })
                const data = await res.json();
                if(res.ok){
                    setSuccess(true);
                }
                else{
                    setError(data.message);
                }
            }
            catch(err){
                setError("Error in creating account, please try later")
                console.error("Error in creating account", err);
            }
            finally{
                setLoading(false);
            }
        }
        else{
            setError("Please type the same password in both fields.")
        }
    }
    function handleSubmit(formData){
        const email = formData.get('email');
        const password = formData.get('password');
        const confirm = formData.get('confirm')
        register(email, password, confirm);
    }
    return(
        <main className={styles.register}>
            <form action={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input name='email' id="email" type="email" required/>
                <label htmlFor="password">Password</label>
                <input name='password' id="password" type="password" minLength='8' required/>
                <label htmlFor="confirm">Confirm Password</label>
                <input name='confirm' id="confirm" type="password" minLength='8' required/>
                <button type='submit'>Register</button>
            </form>
            {success? 
            <p className={styles.success}>
                Congrats! your acount was created successfully, please click the link below to sign in.
            </p>
            : null}
            <Link to='/login'>already have an account</Link>
        </main>
    )
}