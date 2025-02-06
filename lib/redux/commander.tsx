// src/app/store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  commanderOpen: false,
};

const commanderSlice = createSlice({
  name: "commander",
  initialState,
  reducers: {
    open: (state) => {
      state.commanderOpen = true;
    },
    close: (state) => {
      state.commanderOpen = false;
    },
    toggle: (state) => {
      state.commanderOpen = !state.commanderOpen;
    },
  },
});

export const { open, close, toggle } = commanderSlice.actions;

const commanderActionScreen = commanderSlice.reducer;

const commander = configureStore({
  reducer: {
    commanderActionScreen,
  },
});

export default commander;
