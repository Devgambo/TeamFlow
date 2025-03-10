import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn: JSON.parse(localStorage.getItem("loginStatus")) || false,
  accessToken: JSON.parse(localStorage.getItem("at")) || null,
  refreshToken: JSON.parse(localStorage.getItem("rt")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("loginStatus", JSON.stringify(state.isLoggedIn));
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("at", JSON.stringify(state.accessToken));
      localStorage.setItem("rt", JSON.stringify(state.refreshToken));
    },
    logoutUser: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("loginStatus");
      localStorage.removeItem("user");
      localStorage.removeItem("at");
      localStorage.removeItem("rt");
    },
  },
});


export const { logoutUser, setUserCredentials} = authSlice.actions;
export default authSlice.reducer;
