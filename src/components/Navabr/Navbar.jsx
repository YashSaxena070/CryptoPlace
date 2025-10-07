import React, { useState } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import arrow_icon from '../../assets/arrow_icon.png' 
import { useDispatch , useSelector} from 'react-redux'
import { setCurrency, setTheme } from '../../features/cryptoSlice'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currency} = useSelector((state) => state.crypto);
  const {theme} = useSelector((state) => state.crypto)

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    if(value == "usd"){
      dispatch(setCurrency({name:"usd", symbol:"$"}));
    }
    else if(value == "eur"){
      dispatch(setCurrency({name:"eur", symbol:"€"}));
    }
    else if(value == "inr"){
      dispatch(setCurrency({name:"inr", symbol:"₹"}));
    }
  }

  const handleThemeToggle = () => {
    dispatch(setTheme());
  }


  return (
    <div className='navbar'>
      <div className="logo-container">
        <img src={logo} alt="logo" className='logo' onClick={()=> navigate("/")}/>
      </div>
      
      {/* Mobile menu button */}
      {/* <button 
        className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button> */}

      <ul className={`nav-menu ${isMobileMenuOpen ? 'nav-menu-open' : ''}`}>
        <li className='nav-item' onClick={()=> navigate("/")}>Home</li>
        <li className='nav-item'>Features</li>
        <li className='nav-item'>Pricing</li>
        <li className='nav-item'>Blog</li>
      </ul>
      
      <div className="nav-right">
        <button className="theme-toggle-btn" onClick={handleThemeToggle}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <select value={currency.name} onChange={handleCurrencyChange}>
            <option value="usd">USD</option>
            <option value="eur">EURO</option>
            <option value="inr">INR</option>
        </select>
        <button onClick= {()=> navigate("/signup")}>Sign up <img src={arrow_icon} alt="" /></button>
      </div>
    </div>
  )
}

export default Navbar
