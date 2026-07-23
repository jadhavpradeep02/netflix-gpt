import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, USER_AVATAR } from "../utils/constants";

const Header = () => {
    const navigate = useNavigate();
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {})
            .catch(() => {
                navigate("/error");
            });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const { uid, email, displayName, photoURL } = currentUser;
                dispatch(
                    addUser({
                        uid,
                        email,
                        displayName,
                        photoURL,
                    })
                );
                navigate('/browse');
            } else {
                dispatch(removeUser());
                navigate("/");
            }
        });

        return () => unsubscribe();
    }, [dispatch, navigate]);

    return (
        <div className='absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col md:flex-row justify-between'>
            <img
                className='w-44' 
                src={LOGO}
                alt="logo"
            ></img>
            {user && (
                <div className='flex p-2 items-center'>
                    <img className='w-12 h-12 rounded-full'
                        alt="usericon"
                        src={user?.photoURL || USER_AVATAR}
                    />
                    <button onClick={handleSignOut} className="font-bold text-white ml-4">
                        (Sign Out)
                    </button>
                </div>
            )}
        </div>
    )
}

export default Header