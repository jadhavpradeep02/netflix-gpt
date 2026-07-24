import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, USER_AVATAR, SUPPORTED_LANGUAGES } from "../utils/constants";
import { toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";


const Header = () => {
    const navigate = useNavigate();
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

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

    const handleGptSearchClick = () => {
        // Toggle GPT Search
        dispatch(toggleGptSearchView());
    };

    const handleLanguageChange = (e) => {
        dispatch(changeLanguage(e.target.value));
    };

    return (
        <div className='absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col md:flex-row justify-between'>
            <img
                className='w-44' 
                src={LOGO}
                alt="logo"
            ></img>
            {user && (
                <div className='flex p-2 justify-between'>
                    {showGptSearch && (
                        <select className="p-2 m-2 bg-gray-900 text-white" onChange={handleLanguageChange}>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <option key={lang.identifier} value={lang.identifier}>
                            {lang.name}
                            </option>
                        ))}
                        </select>
                    )}
                    <button className="py-2 px-4 mx-4 my-2 bg-purple-800 text-white rounded-lg" onClick={handleGptSearchClick}>
                        {showGptSearch ? "Homepage" : "GPT Search"}
                    </button>
                    <img className='hidden md:block w-12 h-12'
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