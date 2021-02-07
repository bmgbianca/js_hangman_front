import { createSlice } from '@reduxjs/toolkit';

export const idSlice = createSlice({
  name: 'id',
  initialState: {
    value: null,
  },
  reducers: {
    changeId: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeId } = idSlice.actions;

export const selectId = (state) => state.id.value;

export default idSlice.reducer;
