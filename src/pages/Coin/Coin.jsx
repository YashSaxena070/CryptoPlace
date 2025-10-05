import React, { useEffect, useState } from "react";
import "./Coin.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LineChart from "../../components/LineChart/LineChart";
const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currency } = useSelector((state) => state.crypto);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoinData = async (coinId) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}`
        );
        const data = await response.json();
        setCoinData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setLoading(false);
      }
    };
    fetchCoinData(coinId);
    fetchHistoricalData();
  }, [coinId]);

  const fetchHistoricalData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-yXeMgL8UBPbAoJBXQEdrqUzv",
      },
    };

    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
      options
    )
      .then((response) => response.json())
      .then((response) => setHistoricalData(response))
      .catch((err) => console.log(err));
  };

  if (loading)
    return (
      <div className=" loading text-center py-20 text-white">
        Loading coin data...
      </div>
    );
  if (error)
    return (
      <div className="error text-center py-20 text-red-500">Error: {error}</div>
    );
  if (!coinData) return null;

  const formatNumber = (num) => (num == null ? "N/A" : num.toLocaleString());

  return (
    <div>
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Market
      </button>
      <div className="coin-header">
        <img
          src={coinData.image.large}
          alt={coinData.name}
          className="coin-image"
        />
        <p>{coinData.name}</p>
      </div>
      <div className="coin-chart">
        {historicalData ? (
          <LineChart historicalData={historicalData} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      <div className="coin-details">
        <div>
          <p>Crypto Market Rank</p>
          <p>{coinData.market_cap_rank}</p>
        </div>
        <div>
          <p>Current Price</p>
          <p>
            {currency.symbol}{" "}
            {formatNumber(coinData.market_data.current_price[currency.name])}
          </p>
        </div>
        <div>
          <p>Market Cap</p>
          <p>
            {currency.symbol}{" "}
            {formatNumber(coinData.market_data.market_cap[currency.name])}
          </p>
        </div>
        <div>
          <p>24h Price Change</p>
          <p>{coinData.market_data.price_change_percentage_24h}%</p>
        </div>
      </div>
    </div>
  );
};
export default Coin;
