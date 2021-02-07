import { configureStore } from '@reduxjs/toolkit';
import idReducer from '../features/idSlice';
import gameModeReducer from '../features/gameModeSlice';
import gameLevelReducer from '../features/gameLevelSlice';
import gameChoiceReducer from '../features/gameChoiceSlice';
import gameScoreReducer from '../features/gameScoreSlice';

export default configureStore({
  reducer: {
    id: idReducer,
    gameMode: gameModeReducer,
    gameLevel: gameLevelReducer,
    gameChoice: gameChoiceReducer,
    gameScore: gameScoreReducer,
  },
});
