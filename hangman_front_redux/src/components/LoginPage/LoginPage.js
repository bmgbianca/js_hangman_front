import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectGameMode, changeGameMode } from '../../features/gameModeSlice';
import './LoginPage.css';

export default function LoginPage() {
  const [isDisabled, setIsDisabled] = useState(true);

  const gameMode = useSelector(selectGameMode);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (gameMode) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [gameMode]);

  const handleGameMode = (e) => {
    dispatch(changeGameMode(e.target.value));
  };

  const handleNextPage = () => {
    if (gameMode === 'single') {
      history.push('/single-player/level');
    } else if (gameMode === 'friend') {
      history.push('/play-with-a-friend/choose');
    }
  };
  return (
    <main className="background">
      <h1>BIBI'S HANGMAN</h1>
      <h2>O famoso jogo da FORCA!</h2>
      <label htmlFor="gameMode">Como você quer jogar?</label>
      <select
        id="gameMode"
        name="gameMode"
        value={gameMode}
        className="form-select"
        onChange={handleGameMode}
      >
        <option value="">Selecione...</option>
        <option value="single">Sozinho</option>
        <option value="friend">Com um amigo</option>
      </select>
      <button
        className="btn btn-lg"
        disabled={isDisabled}
        onClick={handleNextPage}
      >
        Prosseguir
      </button>
    </main>
  );
}
