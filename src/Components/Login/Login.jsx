import React, { useState } from 'react'
import { assets } from '../../assets/asstes'
import { Firebase } from './Firebase'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged  } from "firebase/auth";

const Login = ({onLogin}) => {
    const style = {
        color: 'black'
    }

    const styleClass = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const auth = getAuth(Firebase.app);


    const formSignUp = (e) => {
        e.preventDefault();
        const email = document.getElementById('floatingInput');
        const password = document.getElementById('floatingPassword');
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorCode, errorMessage);
                // ..
            });
    }

    const formSignIn = (e) => {
        e.preventDefault();
        const email = document.getElementById('floatingInput');
        const password = document.getElementById('floatingPassword');
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const auth = getAuth();
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        // User is signed in, see docs for a list of available properties
                        // https://firebase.google.com/docs/reference/js/auth.user
                        const uid = user.uid;
                        onLogin(true);
                        // ...
                    } else {
                        alert('User is signed out');
                        onLogin(false);
                        // ...
                    }
                });
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorCode, errorMessage);
            });
    }

    return (
        <div className="d-flex align-items-center py-4">
            <main className="form-signin w-100 m-auto">
                <form style={styleClass}>
                    <img className="mb-4" src={assets.video} alt="" width="72" height="80" />
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating mt-4">
                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label htmlFor="floatingInput" style={style}>Email address</label>
                    </div>
                    <div className="form-floating mt-4">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword" style={style}>Password</label>
                    </div>

                    {/* <div className="form-check text-start my-3">
                        <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Remember me
                        </label>
                    </div> */}
                    <div className='d-flex'>
                        <button className="btn btn-primary w-10 m-5  py-2" onClick={formSignUp}>Sign up</button>
                        <button className="btn btn-primary w-10 m-5 py-2" onClick={formSignIn}>Sign in</button>
                    </div>
                    <p className="mt-4 mb-3">© 2017–2024</p>
                </form>
            </main>
        </div>
    )
}

export default Login