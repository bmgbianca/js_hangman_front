import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage.js';
import LevelChoicePage from './components/LevelChoicePage/LevelChoicePage.js';
import FriendPlayPage from './components/FriendPlayPage/FriendPlayPage';
import ChallengerPage from './components/ChallengerPage/ChallengerPage';
import ChallengedPage from './components/ChallengedPage/ChallengedPage';
import GamePage from './components/GamePage/GamePage';

function App() {
  return (
    <Router>
      <Route exact path="/" render={() => <LoginPage />} />
      <Route
        exact
        path="/single-player/level"
        render={() => <LevelChoicePage />}
      />
      <Route
        exact
        path="/play-with-a-friend/choose"
        render={() => <FriendPlayPage />}
      />
      <Route
        exact
        path="/play-with-a-friend/challenger"
        render={() => <ChallengerPage />}
      />
      <Route
        exact
        path="/play-with-a-friend/challenged"
        render={() => <ChallengedPage />}
      />
      <Route path="/single-player/game/" render={() => <GamePage />} />
      <Route path="/play-with-a-friend/game/" render={() => <GamePage />} />
    </Router>
  );
}

export default App;
