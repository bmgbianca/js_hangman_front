import { createSlice } from '@reduxjs/toolkit';

export const gameChoiceSlice = createSlice({
  name: 'gameChoice',
  initialState: {
    value: '',
  },
  reducers: {
    changeGameChoice: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeGameChoice } = gameChoiceSlice.actions;

export const selectGameChoice = (state) => state.gameChoice.value;

export default gameChoiceSlice.reducer;
