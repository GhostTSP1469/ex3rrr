import { configureStore } from "@reduxjs/toolkit";
import { storeApi } from "../shared/api/storeApi";

// Redux-стор оставлен только под RTK Query (серверный кэш).
// Клиентское состояние (auth, wishlist, theme, lang, cartColor) — в Zustand (src/store).
export const store = configureStore({
  reducer: {
    [storeApi.reducerPath]: storeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(storeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
