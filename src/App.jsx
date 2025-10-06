import React from 'react'
import Navbar from './components/Navabr/Navbar'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Coin from './pages/Coin/Coin'
import { useSelector } from 'react-redux'

const App = () => {
  const { theme } = useSelector((state) => state.crypto);
  
  return (
    <div className={`app ${theme}`}>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/coin/:coinId' element={<Coin/>}/>
      </Routes>
    </div>
  )
}

export default App
