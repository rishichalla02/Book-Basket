import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    removeFromHistory: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { removeFromHistory } = historySlice.actions;
export default historySlice.reducer;
