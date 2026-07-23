import React, { useState, useRef } from 'react';
import Header from './Header';
import { checkValidData } from '../utils/validate';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../utils/firebase';
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { USER_AVATAR, BG_IMAGE } from '../utils/constants';

const Login = () => {

    const [isSignInForm, setIsSignInForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const dispatch = useDispatch();

    const email = useRef(null);
    const password = useRef(null);
    const name = useRef(null);

    const toggleSignInForm = () => {
        setIsSignInForm(!isSignInForm);
    }

    const submitForm = () => {
        const errMsg = checkValidData(email.current.value, password.current.value, "Pradeep");
        setErrorMessage(errMsg);
        if(errMsg) return;

        if(!isSignInForm) {
            //sign up logic
            createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
                .then((userCredential) => {
                    const user = userCredential.user;
                    updateProfile(user, {
                        displayName: name.current.value,
                        photoURL: USER_AVATAR
                    }).then(() => {
                        const { uid, email, displayName, photoURL } = auth.currentUser;
                        dispatch(
                            addUser({
                                uid: uid,
                                email: email,
                                displayName: displayName,
                                photoURL: photoURL,
                            })
                        );
                    }).catch((error) => {
                        setErrorMessage(error.message);
                    })
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMessage(errorCode + ' - ' + errorMessage);
                });
        } else {
            //sign in logic
            signInWithEmailAndPassword(auth, email.current.value, password.current.value)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMessage(errorCode + ' - ' + errorMessage);
                });
        }
    }


    return (
        <div>
            <Header />
            <div className='absolute'>
                <img 
                    className='w-full h-full object-cover'
                    src={BG_IMAGE}
                    alt="logo"
                />
            </div>
            <form onClick={(e) => e.preventDefault()} className='w-3/12 absolute bg-black p-12 my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80'>
                <h1 className='font-bold text-3xl py-4'>{isSignInForm ? "Sign In" : "Sign Up"}</h1>

                {!isSignInForm && (
                    <input ref={name} type="text" placeholder='Username' className='p-4 my-4 w-full bg-gray-700' />
                )}

                <input  ref={email}
                        type="text" 
                        placeholder='Email Address'
                        className='p-4 my-4 w-full bg-gray-700' />

                <input  ref={password}
                        type="password" 
                        placeholder='Password' 
                        className='p-4 my-4 w-full bg-gray-700' />

                <p className="text-red-500 font-bold text-lg py-2">{errorMessage}</p>

                <button className='p-4 my-6 bg-red-700 w-full rounded-lg' onClick={submitForm}>Sign In</button>

                <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>
                    { isSignInForm ? "New to Netflix? Sign up now" : "Already registered? Sign In Now." }
                </p>
            </form>
        </div>
    )
}

export default Login