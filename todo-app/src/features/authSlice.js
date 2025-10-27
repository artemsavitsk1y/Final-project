import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("loggedIn", "true");
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("loggedIn");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;