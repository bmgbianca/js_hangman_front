import { createSlice } from '@reduxjs/toolkit';

export const gameLevelSlice = createSlice({
  name: 'gameLevel',
  initialState: {
    value: '',
  },
  reducers: {
    changeGameLevel: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeGameLevel } = gameLevelSlice.actions;

export const selectGameLevel = (state) => state.gameLevel.value;

export default gameLevelSlice.reducer;
