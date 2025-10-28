import React, { useState, useEffect, useRef } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import arrow_icon from '../../assets/arrow_icon.png' 
import { useDispatch , useSelector} from 'react-redux'
import { setCurrency, setTheme, clearWatchlist } from '../../features/cryptoSlice'
import { logout } from '../../features/userSlice'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currency} = useSelector((state) => state.crypto);
  const {theme} = useSelector((state) => state.crypto);
  const {user, isLoggedIn} = useSelector((state) => state.user);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWatchlist());
    setShowProfileDropdown(false);
    navigate('/');
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className='navbar '>
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
        
        {isLoggedIn && user ? (
          <div className="user-profile" ref={dropdownRef}>
            <div 
              className="profile-button" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <span className="profile-icon">👤</span>
              <span className="username">{user.displayName || user.email}</span>
            </div>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-item">
                  <span className="profile-icon">👤</span>
                  <span>{user.displayName || 'User'}</span>
                </div>
                <div className="dropdown-item">
                  <span className="email-icon">📧</span>
                  <span>{user.email}</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <span className="logout-icon">🚪</span>
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate("/signup")}>
            Sign up <img src={arrow_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar
