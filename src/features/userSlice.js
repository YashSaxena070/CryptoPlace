import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: { user: null, isLoggedIn: false},
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) =>{
            state.user = null;
            state.isLoggedIn = false;
        }
    }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;