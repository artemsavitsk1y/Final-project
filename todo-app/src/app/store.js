import { configureStore } from '@reduxjs/toolkit';
import todoSlice from '../features/todoSlice'; 
import authReducer from "../features/authSlice";
export const store = configureStore({
  reducer: {
    todos: todoSlice,
    auth: authReducer,
  },
});

export default store;