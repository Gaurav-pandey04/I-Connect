import React, { useState } from 'react'
import { assets } from '../../assets/asstes'
import { Firebase } from './Firebase'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = ({ onLogin }) => {
    const style = {
        color: 'black'
    }

    const styleClass = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const widthStyle = {
        width: '92px',
        height: '85px'
    }

    const auth = getAuth(Firebase.app);
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });


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
                        // alert('User is signed out');
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

    const googleSignIn = (e) => {
        e.preventDefault();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                onLogin(true)
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                alert(errorCode, errorMessage, email, credential)
                // ...
            });
    }

    return (
        <div className="d-flex align-items-center py-4">
            <main className="form-signin w-100 m-auto">
                <form style={styleClass}>
                    <img className="mb-4" src={assets.video} alt="" width="92" height="80" style={widthStyle} />
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating mt-4">
                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label htmlFor="floatingInput" style={style}>Email address</label>
                    </div>
                    <div className="form-floating mt-4">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword" style={style}>Password</label>
                    </div>

                    <div className="form-check text-start">
                        <button className="btn btn-primary w-10 m-5  py-1" onClick={googleSignIn}>Google
                        <img src={assets.google} alt="" className='m-1'/></button>
                    </div>
                    <div className='d-flex'>
                        <button className="btn btn-primary w-10 mb-5  py-2" onClick={formSignUp}>Sign up</button>
                        <button className="btn btn-primary w-10 mb-5 py-2" onClick={formSignIn}>Sign in</button>
                    </div>
                    <p className="mt-4 mb-3">©I-connect - 2024</p>
                </form>
            </main>
        </div>
    )
}

export default Login