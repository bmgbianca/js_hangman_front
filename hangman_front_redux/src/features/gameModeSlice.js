import { createSlice } from '@reduxjs/toolkit';

export const gameModeSlice = createSlice({
  name: 'gameMode',
  initialState: {
    value: '',
  },
  reducers: {
    changeGameMode: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeGameMode } = gameModeSlice.actions;

export const selectGameMode = (state) => state.gameMode.value;

export default gameModeSlice.reducer;
