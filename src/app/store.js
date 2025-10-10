import {configureStore} from '@reduxjs/toolkit';
import cryptoReducer from '../features/cryptoSlice.js';
import userReducer from '../features/userSlice.js';
export const store = configureStore({
    reducer: {
        crypto: cryptoReducer,
        user: userReducer,
    },
})