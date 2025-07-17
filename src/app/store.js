// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookReducer from "../feature/books/bookSlice";
import cartReducer from "../feature/books/cartSlice";
import historyReducer from "../feature/books/historySlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Combine all slices
const rootReducer = combineReducers({
  books: bookReducer,
  cart: cartReducer,
  history: historyReducer,
});

// Config for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // only persist the cart
};

// Apply persistence to root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
        ignoredPaths: ["_persist"],
      },
    }),
});

// Export persistor for wrapping with PersistGate
export const persistor = persistStore(store);

export default store;
