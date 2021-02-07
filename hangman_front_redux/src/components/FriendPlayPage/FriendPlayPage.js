import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectGameChoice,
  changeGameChoice,
} from '../../features/gameChoiceSlice';

export default function FriendPlayPage() {
  const [isDisabled, setIsDisabled] = useState(true);

  const gameChoice = useSelector(selectGameChoice);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (gameChoice) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [gameChoice]);

  const handleGameChoice = (e) => {
    dispatch(changeGameChoice(e.target.value));
  };

  const handleNextFriendPage = () => {
    if (gameChoice === 'say') {
      history.push('/play-with-a-friend/challenger');
    } else if (gameChoice === 'guess') {
      history.push('/play-with-a-friend/challenged');
    }
  };

  return (
    <main className="background">
      <h1>BIBI'S HANGMAN</h1>
      <h2>O famoso jogo da FORCA!</h2>
      <label htmlFor="friendChoice">
        Você vai passar a palavra ou adivinhar?
      </label>
      <select
        id="gameChoice"
        name="gameChoice"
        value={gameChoice}
        className="form-select"
        onChange={handleGameChoice}
      >
        <option value="">Selecione...</option>
        <option value="say">Passar a palavra</option>
        <option value="guess">Adivinhar a palavra</option>
      </select>
      <button
        className="btn btn-lg"
        disabled={isDisabled}
        onClick={handleNextFriendPage}
      >
        JOGAR!
      </button>
    </main>
  );
}
