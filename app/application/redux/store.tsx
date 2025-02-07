import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  commanderOpen: false,
  focusMode: false,
};

const storeSlice = createSlice({
  name: "editPageStoreValues",
  initialState,
  reducers: {
    openCommander: (state) => {
      state.commanderOpen = true;
    },
    closeCommander: (state) => {
      state.commanderOpen = false;
    },
    toggleCommander: (state) => {
      state.commanderOpen = !state.commanderOpen;
    },
    toggleFocus: (state) => {
      state.focusMode = !state.focusMode;
    },
  },
});

export const { openCommander, closeCommander, toggleCommander, toggleFocus } =
  storeSlice.actions;

const store = configureStore({
  reducer: {
    store: storeSlice.reducer,
  },
});

export default store;
