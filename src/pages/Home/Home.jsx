import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {fetchCrypto, setCurrency} from '../../features/cryptoSlice'

import './Home.css'
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {coins, status, error, currency} = useSelector((state) => state.crypto);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
     if(status === 'idle'){
      dispatch(fetchCrypto(currency.name));
     }
  }, [dispatch, status, currency.name])
  
  const filteredCoins = (coins || []).filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())   
  );

  const formatNumber = (num) => {
    if(num == null) return "N/A";
    return num.toLocaleString();
  };

  return (
    <div className='home'>
      <div className="hero">
        <h1>Your Gateway to the <br /> Crypto Universe</h1>
        <p>Track, analyze, and stay ahead in the dynamic world of cryptocurrency with real-time data and powerful insights.</p>
        <form onSubmit={(e) => e.preventDefault()} >
            <input type="text" placeholder='Search crypto..' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
            <button type='submit'>Search</button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
            <p>#</p>
            <p>Coins</p>
            <p>Price</p>
            <p style={{textAlign:"center"}}>24H Change</p>
            <p className='market-cap'>Market Cap</p>
        </div>

        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>{error}</p>}

        {status === 'succeeded' && filteredCoins?.length > 0 && (
            filteredCoins.slice(0, 15).map((coin, index) => (
              <div className="table-layout" key={coin.id} onClick={()=>navigate(`/coin/${coin.id}`)}>
                <p>{index+1}</p>
                <p><img style={{width: "20px", height: "20px", marginRight: "10px", }} src={coin.image} alt="" />{coin.name}</p>
                <p>{currency.symbol} {formatNumber(coin.current_price)}</p>
                <p style={{textAlign: "center"}}>{coin.price_change_percentage_24h}%</p>
                <p className='market-cap'>{currency.symbol} {formatNumber(coin.market_cap)}</p>
              </div>
             ))
            )}

      </div>
    </div>
  );
};

export default Home
