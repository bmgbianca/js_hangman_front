import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectGameLevel,
  changeGameLevel,
} from '../../features/gameLevelSlice';

export default function LevelChoicePage() {
  const [isDisabled, setIsDisabled] = useState(true);

  const gameLevel = useSelector(selectGameLevel);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (gameLevel) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [gameLevel]);

  const handleGameLevel = (e) => {
    dispatch(changeGameLevel(e.target.value));
  };

  return (
    <main className="background">
      <h1>BIBI'S HANGMAN</h1>
      <h2>O famoso jogo da FORCA!</h2>
      <label htmlFor="gameLevel">Escolha o nível de dificuldade:</label>
      <select
        id="gameLevel"
        name="gameLevel"
        value={gameLevel}
        className="form-select"
        onChange={handleGameLevel}
      >
        <option value="">Selecione...</option>
        <option value="easy">Fácil</option>
        <option value="normal">Intermediário</option>
        <option value="hard">Difícil</option>
        <option value="expert">Profissional</option>
      </select>
      <button
        className="btn btn-lg"
        disabled={isDisabled}
        onClick={() => history.push(`/single-player/game/${gameLevel}`)}
      >
        JOGAR!
      </button>
    </main>
  );
}
