import React, { useState, useEffect } from 'react';
import { postNewWord } from '../../services/requestsServices';
import { changeId } from '../../features/idSlice';
import { useDispatch } from 'react-redux';
import ScoreModal from '../ScoreModal/ScoreModal';
import './ChallengerPage.css';

export default function ChallengerPage() {
  const [gameWord, setGameWord] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  const text = document.getElementById('text');
  let inputField = document.getElementById('input');
  const idDiv = document.getElementById('idDiv');
  const idParagraph = document.getElementById('idParagraph');
  const instructionParagraph = document.getElementById('instruction');
  const sendButton = document.getElementById('sendButton');
  const iconsDiv = document.getElementById('iconsDiv');

  useEffect(() => {
    inputField = document.getElementById('input');
    inputField.focus();
  }, []);

  useEffect(() => {
    const noSpacesGameWord = gameWord.trim();
    if (noSpacesGameWord) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [gameWord]);

  const handleGameWord = (e) => {
    setGameWord(e.target.value);
    const noSpacesGameWord = gameWord.trim();
    if (noSpacesGameWord && e.key === 'Enter') {
      sendWord();
    } else if (e.key === 'Escape') {
      setGameWord('');
    }
  };

  const sendWord = async () => {
    try {
      const res = await postNewWord(gameWord);
      dispatch(changeId(res.data));
      text.textContent = 'Este é o ID da sua palavra secreta:';
      inputField.classList.add('noShow');
      idDiv.classList.remove('noShow');
      idDiv.classList.add('idDiv');
      idParagraph.textContent = res.data;
      instructionParagraph.classList.remove('noShow');
      iconsDiv.classList.remove('noShow');
      iconsDiv.classList.add('buttonsDiv');
      sendButton.classList.remove('sendButton');
      sendButton.classList.add('noShow');
    } catch (err) {
      alert(err);
      console.log(err);
      setGameWord('');
    }
  };

  const copyIdNumber = () => {
    const range = document.createRange();
    range.selectNode(idParagraph);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('ID copiado');
  };

  const typeNewWord = () => {
    setGameWord('');
    inputField.classList.remove('noShow');
    idDiv.classList.add('noShow');
    idDiv.classList.remove('idDiv');
    iconsDiv.classList.remove('buttonsDiv');
    iconsDiv.classList.add('noShow');
    instructionParagraph.classList.add('noShow');
    sendButton.classList.remove('noShow');
    sendButton.classList.add('sendButton');
  };

  const handleScoreModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <main className="wordChoiceBackground">
      <h1 className="title">BIBI'S HANGMAN</h1>
      <h2>O famoso jogo da FORCA!</h2>
      <section className="wordTypeField">
        <label id="text" htmlFor="gameWord">
          Digite abaixo a palavra que seu oponente terá que adivinhar:
        </label>
        <input
          id="input"
          name="gameWord"
          value={gameWord}
          type="text"
          onChange={handleGameWord}
          onKeyUp={handleGameWord}
        />
        <div className="noShow" id="idDiv">
          <p id="idParagraph"></p>
          <button id="copyButton" className="copyButton" onClick={copyIdNumber}>
            {' '}
            Copiar ID{' '}
          </button>
        </div>
        <button
          id="sendButton"
          className="btn btn-lg sendButton"
          disabled={isDisabled}
          onClick={sendWord}
        >
          ENVIAR!
        </button>
        <p id="instruction" className="noShow">
          Envie esse ID para o seu oponente para que ele possa jogar com a
          palavra secreta que você enviou!
        </p>
        <div id="iconsDiv" className="noShow">
          <button
            className="btn btn-sm iconButton"
            title="Enviar nova palavra"
            onClick={typeNewWord}
          >
            <i className="bi-arrow-repeat"></i>
          </button>
          <button
            className="btn btn-sm iconButton"
            title="Ver pontuação do seu amigo"
            onClick={handleScoreModal}
          >
            <i className="bi-clipboard"></i>
          </button>
        </div>
      </section>
      {isModalOpen && (
        <ScoreModal
          source={true}
          message="A PONTUAÇÃO DO SEU OPONENTE É:"
          closeModal={handleScoreModal}
        />
      )}
    </main>
  );
}
