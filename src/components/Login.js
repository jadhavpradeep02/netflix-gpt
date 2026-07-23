import React, { useState, useRef } from 'react';
import Header from './Header';
import { checkValidData } from '../utils/validate';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../utils/firebase';
import { addUser } from "../utils/userSlice";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

const Login = () => {

    const [isSignInForm, setIsSignInForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
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
                        photoURL: "https://occ-0-6247-2164.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png?r=e6e"
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
                        navigate('/browse');
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
                    navigate("/browse");
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
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/ffa9d590-69c5-406f-bff9-e2ced3baa6ad/web/IN-en-20260713-TRIFECTA-perspective_75c0557e-9bbb-4149-9913-b87d4d7a30b7_large.jpg"
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