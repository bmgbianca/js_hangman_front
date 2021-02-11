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
  const [text, setText] = useState(
    'Digite abaixo a palavra que seu oponente terá que adivinhar:'
  );
  const [idNumber, setIdNumber] = useState('');
  const [inputFieldClass, setInputFieldClass] = useState('inputField');
  const [sendButtonDivClass, setSendButtonDivClass] = useState('sendButtonDiv');
  const [idDivClass, setIdDivClass] = useState('noShow');
  const [instructionParagraphClass, setInstructionParagraphClass] = useState(
    'noShow'
  );
  const [iconsDivClass, setIconsDivClass] = useState('noShow');

  const dispatch = useDispatch();

  let inputField = document.getElementById('input');
  const idParagraph = document.getElementById('idParagraph');
  let tooltip = document.querySelector('[data-bs-toggle="tooltip"]');

  useEffect(() => {
    inputField = document.getElementById('input');
    inputField.focus();
  }, []);

  const teste = () => {
    if (tooltip) {
      tooltip.removeAttribute('title');
    }
  };
  useEffect(() => {
    tooltip = document.querySelector('[data-bs-toggle="tooltip"]');
    window.addEventListener('popstate', teste);
  }, [idNumber]);

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
      setText('Este é o ID da sua palavra secreta:');
      setInputFieldClass('noShow');
      setIdDivClass('idDiv');
      setIdNumber(res.data);
      setInstructionParagraphClass('instruction');
      setIconsDivClass('buttonsDiv');
      setSendButtonDivClass('noShow');
      new window.bootstrap.Tooltip(tooltip);
    } catch (err) {
      if (err.response) {
        alert(err.response.data);
        setGameWord('');
      } else {
        alert(err);
        setGameWord('');
      }
    }
  };

  const copyIdNumber = () => {
    const range = document.createRange();
    range.selectNode(idParagraph);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    const tooltipInner = document.querySelector('.tooltip-inner');
    tooltipInner.textContent = 'ID copiado';
  };

  const typeNewWord = () => {
    setGameWord('');
    setText('Digite abaixo a palavra que seu oponente terá que adivinhar:');
    setIdDivClass('noShow');
    setInstructionParagraphClass('noShow');
    setIconsDivClass('noShow');
    setInputFieldClass('inputField');
    setSendButtonDivClass('sendButtonDiv');
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
          {text}
        </label>
        <input
          id="input"
          className={inputFieldClass}
          name="gameWord"
          value={gameWord}
          type="text"
          onChange={handleGameWord}
          onKeyUp={handleGameWord}
        />
        <div className={idDivClass} id="idDiv">
          <p id="idParagraph" className="idParagraph">
            {idNumber}
          </p>
          <button
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Copiar"
            id="copyButton"
            className="copyButton"
            onClick={copyIdNumber}
          >
            {' '}
            Copiar ID{' '}
          </button>
        </div>
        <div className={sendButtonDivClass}>
          <button
            id="sendButton"
            className="btn btn-lg sendButton"
            disabled={isDisabled}
            onClick={sendWord}
          >
            ENVIAR!
          </button>
        </div>
        <p id="instruction" className={instructionParagraphClass}>
          Envie esse ID para o seu oponente para que ele possa jogar com a
          palavra secreta que você enviou!
        </p>
        <div id="iconsDiv" className={iconsDivClass}>
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
