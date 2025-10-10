import React, { useEffect } from 'react'
import Navbar from './components/Navabr/Navbar'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Coin from './pages/Coin/Coin'
import { useSelector, useDispatch } from 'react-redux'
import { initializeWatchlist } from './features/cryptoSlice'
import Signup from './pages/SignUp/Signup'

const App = () => {
  const { theme } = useSelector((state) => state.crypto);
  const dispatch = useDispatch();
  const location = useLocation();
  const hideNavbar = location.pathname === '/signup';
  
  useEffect(() => {
    dispatch(initializeWatchlist());
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
