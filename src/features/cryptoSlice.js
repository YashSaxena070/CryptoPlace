import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// 1. Async Thunk for fetching crypto data
export const fetchCrypto = createAsyncThunk(
    'crypto/fetchCrypto',
    async (currencyName, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currencyName}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            if (!Array.isArray(data)) {
                 throw new Error("API did not return an array of coins.");
            }
            return data;
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
);

// 2. Crypto Slice
const cryptoSlice = createSlice({
    name: "crypto",
    initialState: {
        coins: [],
        status: "idle", // idle, loading, succeeded, failed
        error: null,
        currency: { name: "usd", symbol: "$" },
    },
    reducers: {
        setCurrency: (state, action) => {
            state.currency = action.payload;
            state.status = 'idle'; // Reset status to trigger refetch
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCrypto.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCrypto.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.coins = action.payload;
            })
            .addCase(fetchCrypto.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setCurrency } = cryptoSlice.actions;
export default cryptoSlice.reducer;