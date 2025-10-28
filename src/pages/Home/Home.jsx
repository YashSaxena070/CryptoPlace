import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {fetchCrypto, setCurrency, toggleWatchlist} from '../../features/cryptoSlice'
import { StarIcon } from '../StarIcon'
import './Home.css'
import { useNavigate } from 'react-router-dom';
import { db, auth } from "../../firebase";
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import Chatbot from '../../components/ChatBot/Chatbot'
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {coins, status, error, currency, watchlist} = useSelector((state) => state.crypto);
  const {isAuthenticated} = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState("all");


  useEffect(() => {
     if(status === 'idle'){
      dispatch(fetchCrypto(currency.name));
     }
  }, [dispatch, status, currency.name])

  // Watchlist is now loaded in App.jsx when auth state is restored

  const displayedCoin = view === "watchlist" 
   ? (coins || []).filter(coin => watchlist.includes(coin.id)) 
   : coins;
  
  const filteredCoins = (displayedCoin || []).filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())   
  );

  const formatNumber = (num) => {
    if(num == null) return "N/A";
    return num.toLocaleString();
  };

  // Add coin to watchlist in database
  const addToWatchlist = async (coinId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return;
    }

    console.log("Adding to watchlist:", coinId, "for user:", user.uid);

    try {
      const userDocRef = doc(db, "users", user.uid);
      
      // First check if document exists
      const userDoc = await getDoc(userDocRef);
      console.log("User document exists:", userDoc.exists());
      
      if (userDoc.exists()) {
        // Document exists, update it
        console.log("Updating existing document");
        await updateDoc(userDocRef, {
          watchlist: arrayUnion(coinId)
        });
      } else {
        // Document doesn't exist, create it with the watchlist
        console.log("Creating new document");
        await setDoc(userDocRef, {
          watchlist: [coinId]
        }, { merge: true });
      }
      
      console.log(`${coinId} added to watchlist successfully`);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      console.error("Error details:", error.code, error.message);
      console.error("Full error object:", error);
      alert(`Failed to add to watchlist: ${error.message}`);
    }
  };

  // Remove coin from watchlist in database
  const removeFromWatchlist = async (coinId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      
      // First check if document exists
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Document exists, update it
        await updateDoc(userDocRef, {
          watchlist: arrayRemove(coinId)
        });
        console.log(`${coinId} removed from watchlist`);
      } else {
        // Document doesn't exist, nothing to remove
        console.log("User document doesn't exist, nothing to remove");
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      console.error("Error details:", error.code, error.message);
      alert(`Failed to remove from watchlist: ${error.message}`);
    }
  };

  // Handle star icon click
  const handleStarClick = async (coinId) => {
    const isWatched = watchlist.includes(coinId);
    
    // Update Redux state immediately for UI responsiveness
    dispatch(toggleWatchlist(coinId));
    
    // Update database
    if (isWatched) {
      await removeFromWatchlist(coinId);
    } else {
      await addToWatchlist(coinId);
    }
  };

  return (
    <div className={`home ${isAuthenticated ? 'with-chatbot' : ''}`}>
      <div className="home-main-content">
        <div className="hero">
          <h1>Your Gateway to the <br /> Crypto Universe</h1>
          <p>Track, analyze, and stay ahead in the dynamic world of cryptocurrency with real-time data and powerful insights.</p>
          <form onSubmit={(e) => e.preventDefault()} >
              <input type="text" placeholder='Search crypto..' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
              <button type='submit'>Search</button>
          </form>
        </div>
        <div className="crypto-table">
        <div className="filtering">
          <button 
            className={view === "all" ? "active" : ""}
            onClick={() => setView("all")}
          >
            All Coins
          </button>
          <button 
            className={view === "watchlist" ? "active" : ""}
            onClick={() => setView("watchlist")}
          >
            Watchlist
          </button>
        </div>
        <div className="table-layout">
            <p>#</p>
            <p>Coins</p>
            <p>Price</p>
            <p style={{textAlign:"center"}}>24H Change</p>
            <p className='market-cap'>Market Cap</p>
            <p></p>
        </div>

        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>{error}</p>}

        {status === 'succeeded' && view === 'watchlist' && filteredCoins?.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
            <p>No coins in your watchlist yet.</p>
            <p>Click the star icon next to any coin to add it to your watchlist!</p>
          </div>
        )}

        {status === 'succeeded' && filteredCoins?.length > 0 && (
            filteredCoins.slice(0, 15).map((coin, index) => {
              const isWatched = watchlist.includes(coin.id);
              return (
                <div className="table-layout" key={coin.id} onClick={()=>navigate(`/coin/${coin.id}`)}>
                 <p>{index+1}</p>
                 <p><img style={{width: "20px", height: "20px", marginRight: "10px", }} src={coin.image} alt="" />{coin.name}</p>
                 <p>{currency.symbol} {formatNumber(coin.current_price)}</p>
                 <p style={{textAlign: "center"}}>{coin.price_change_percentage_24h}%</p>
                 <p className='market-cap'>{currency.symbol} {formatNumber(coin.market_cap)}</p>
                 <StarIcon  isFilled={isWatched} onClick={(e) => {
                  e.stopPropagation(); 
                  handleStarClick(coin.id);
                 }} 
                  />
                </div>
              )
              })
            )}

        </div>
      </div>
      {isAuthenticated && (
        <div className="chatBot">
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default Home
