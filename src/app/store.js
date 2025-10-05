import {configureStore} from '@reduxjs/toolkit';
import cryptoReducer from '../features/cryptoSlice.js';

export const store = configureStore({
    reducer: {
        crypto: cryptoReducer,
    },
})