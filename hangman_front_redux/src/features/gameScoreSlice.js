import { createSlice } from '@reduxjs/toolkit';

export const gameScoreSlice = createSlice({
  name: 'gameScore',
  initialState: {
    value: 0,
  },
  reducers: {
    changeGameScore: (state, action) => {
      state.value += action.payload;
    },
    resetGameScore: (state) => {
      state.value = 0;
    },
  },
});

export const { changeGameScore, resetGameScore } = gameScoreSlice.actions;

export const selectGameScore = (state) => state.gameScore.value;

export default gameScoreSlice.reducer;
