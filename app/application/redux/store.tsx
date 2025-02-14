import { configureStore, createSlice } from "@reduxjs/toolkit";

import {
  CurrentConfigurationClass,
  CurrentConfigurationOptions,
} from "../model/text_configuration_model";

const initialState = {
  commanderOpen: false,
  focusMode: false,
  currentConfigurations: new CurrentConfigurationClass().toObject(),
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
    updateTextConfiguration: (state, action) => {
      const { key, value } = action.payload;
      const config = new CurrentConfigurationClass();

      config.loadFromObject(state.currentConfigurations);

      switch (key) {
        case CurrentConfigurationOptions.ALIGNMENT:
          config.setAlignment(value);
          break;
        case CurrentConfigurationOptions.COLOR:
          config.setColor(value);
          break;
        case CurrentConfigurationOptions.BACKGROUND_COLOR:
          config.setBackgroundColor(value);
          break;
        case CurrentConfigurationOptions.FONT_SIZE:
          const size = parseInt(value, 10);

          if (isNaN(size)) throw new Error("Invalid font size value");
          if (size < 8 || size > 128) throw new Error("Font size out of range");
          config.setFontSize(size);
          break;
        case CurrentConfigurationOptions.FONT_WEIGHT:
          config.setFontWeight(value);
          break;
        case CurrentConfigurationOptions.FONT_FAMILY:
          config.setFontFamily(value);
          break;
        case CurrentConfigurationOptions.TEXT_STYLE:
          config.setBold(false);
          config.setItalic(false);
          config.setStrikethrough(false);
          config.setUnderline(false);
          for (const style of value) {
            switch (style) {
              case "italic":
                config.setItalic();
                break;
              case "strikethrough":
                config.setStrikethrough();
                break;
              case "underline":
                config.setUnderline();
                break;
              case "bold":
                config.setBold();
                break;
              default:
                throw new Error("Invalid text style");
            }
          }
          break;
        default:
          throw new Error("Invalid configuration key");
      }
      state.currentConfigurations = config.toObject();
    },
    updateConfigurationFromObject: (state, action) => {
      state.currentConfigurations = action.payload.configuration;
    },
  },
});

export const {
  openCommander,
  closeCommander,
  toggleCommander,
  toggleFocus,
  updateTextConfiguration,
  updateConfigurationFromObject,
} = storeSlice.actions;

const store = configureStore({
  reducer: {
    store: storeSlice.reducer,
  },
});

export default store;
