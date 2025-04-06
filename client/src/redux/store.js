import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authApi from "./api/authApi";
import blogApi from "./api/blogApi";
import authSlice from "./slices/authSlice";
import modalSlice from "./slices/modalSlice";

// Configure Redux store
export const store = configureStore({
  reducer: {
    modal: modalSlice,
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, blogApi.middleware),
});

setupListeners(store.dispatch);

export default store;
