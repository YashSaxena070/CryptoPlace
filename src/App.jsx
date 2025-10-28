import React, { useEffect } from 'react'
import Navbar from './components/Navabr/Navbar'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Coin from './pages/Coin/Coin'
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from './features/userSlice'
import { setWatchlistFromStorage } from './features/cryptoSlice'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import Signup from './pages/SignUp/Signup'

const App = () => {
  const { theme } = useSelector((state) => state.crypto);
  const dispatch = useDispatch();
  const location = useLocation();
  const hideNavbar = location.pathname === '/signup';

  // Listen for Firebase Auth state changes and restore user session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, restore their session
        const { uid, email, displayName } = user;
        dispatch(login({ uid, email, displayName }));
        
        // Load user's watchlist from database
        try {
          const userDocRef = doc(db, "users", uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.watchlist) {
              dispatch(setWatchlistFromStorage(userData.watchlist));
            }
          }
        } catch (error) {
          console.error("Error loading watchlist on auth restore:", error);
        }
      } else {
        // User is signed out, clear Redux state
        dispatch(logout());
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className={`app ${theme}`}>
      { !hideNavbar && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/coin/:coinId' element={<Coin/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </div>
  )
}

export default App