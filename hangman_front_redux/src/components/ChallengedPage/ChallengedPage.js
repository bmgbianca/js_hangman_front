import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getFriendWord } from '../../services/requestsServices';
import { changeId } from '../../features/idSlice';

export default function ChallengedPage() {
  const [gameId, setGameId] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const noSpacesGameId = gameId.trim();
    if (noSpacesGameId) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [gameId]);

  const handleGameId = (e) => {
    setGameId(e.target.value);
    if (e.key === 'Enter') {
      goToGamePage();
    } else if (e.key === 'Escape') {
      setGameId(null);
    }
  };

  const goToGamePage = async () => {
    try {
      await getFriendWord(gameId);
      dispatch(changeId(gameId));
      history.push(`/play-with-a-friend/game/${gameId}`);
    } catch (e) {
      const error = new Error(
        'Oh oh! Parece que este não é um ID válido! Verifique com seu oponente qual o ID correto.'
      );
      alert(error);
    }
  };

  return (
    <main className="wordChoiceBackground">
      <h1 className="title">BIBI'S HANGMAN</h1>
      <h2>O famoso jogo da FORCA!</h2>
      <section className="wordTypeField">
        <label id="text" htmlFor="gameWord">
          Insira abaixo o ID enviado pelo seu oponente:
        </label>
        <input
          id="gameId"
          name="gameId"
          value={gameId}
          type="text"
          onChange={handleGameId}
          onKeyUp={handleGameId}
        />
        <button
          id="sendButton"
          className="btn btn-lg playButton"
          disabled={isDisabled}
          onClick={goToGamePage}
        >
          JOGAR!
          <i className="bi-controller"></i>
        </button>
      </section>
    </main>
  );
}
