import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  generalLettersArray,
  simplifyLetters,
  defineSelector,
  disableLetters,
} from './GamePageHelpers';
import {
  getDatabaseWord,
  getFriendWord,
  postScore,
} from '../../services/requestsServices';
import { selectId, changeId } from '../../features/idSlice';
import { selectGameLevel } from '../../features/gameLevelSlice';
import {
  selectGameScore,
  changeGameScore,
  resetGameScore,
} from '../../features/gameScoreSlice';
import ScoreModal from '../ScoreModal/ScoreModal';
import './GamePage.css';

export default function GamePage() {
  const [roundWordLetters, setRoundWordLetters] = useState([]);
  const [
    roundWordLettersWithoutHyphen,
    setRoundWordLettersWithoutHyphen,
  ] = useState([]);
  const [lettersCount, setLettersCount] = useState(0);
  const [countDown, setCountDown] = useState(20);
  const [timeInterval, setTimeInterval] = useState(null);
  const [shortPause, setShortPause] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [postFinalScore, setPostFinalScore] = useState(false);

  /*Seleção das variáveis globais do Redux - id e gameLevel indicam como 
  deve ser puxada a palavra da base de dados para o jogo, enquanto gameScore 
  é para guardar a pontuação do jogador que será postada na base de dados.*/
  const id = useSelector(selectId);
  const gameLevel = useSelector(selectGameLevel);
  const gameScore = useSelector(selectGameScore);

  const dispatch = useDispatch();

  const history = useHistory();

  /*Aqui, selecionamos os elementos do HTML, que sofrerão mudanças ao longo do 
  jogo, como aparecer, desaparecer ou receber uma outra source.*/
  const hangImage = document.querySelector('.hang');
  const messageParagraph = document.getElementById('message');
  const x = document.getElementById('bigX');
  const mainContent = document.getElementById('main');
  const endGameDiv = document.getElementById('endGame');
  const timerDiv = document.getElementById('timerDiv');
  const timer = document.querySelector('.countDownParagraph');
  const bell = document.getElementById('erro');
  const claps = document.getElementById('aplausos');
  const awnSound = document.getElementById('awn');

  /*Esta variável será um timeInterval, que vai ser limpo (clearInterval) 
  no retorno do primeiro useEffect (abaixo).*/
  let countDownChange;

  /*Este useEffect puxa a palavra da base de dados de acordo com a escolha do 
  jogador e inicia o timer para a escolha da primeira letra.*/
  useEffect(() => {
    const getRoundWord = async () => {
      const gameOption = window.location.href.split('/')[3];
      const urlGameInfo = window.location.href.split('/').pop();
      let response;
      let word;
      if (gameOption === 'play-with-a-friend') {
        response = await getFriendWord(id || urlGameInfo);
        word = response.data;
      } else {
        response = await getDatabaseWord(gameLevel || urlGameInfo);
        word = response.data.word;
        dispatch(changeId(response.data.id));
      }
      const roundWord = word;
      const roundWordLettersArray = [];
      for (let i = 0; i < roundWord.length; i++) {
        roundWordLettersArray.push(roundWord[i]);
      }
      setRoundWordLetters(roundWordLettersArray);
      removeHyphens(roundWordLettersArray);
    };
    getRoundWord();
    if (roundWordLetters) {
      countDownChange = setInterval(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
      setTimeInterval(countDownChange);
    }
    return () => {
      clearInterval(countDownChange);
    };
  }, []);

  /*Esta função, chamada no useEffect acima, deixa os hífens da palavra visíveis, 
  caso haja, e setta a variável de estado com as letras da palavra do jogo sem o hífen.*/
  const removeHyphens = (lettersArray) => {
    if (lettersArray.includes('-')) {
      const hyphen = document.querySelectorAll('[alt="-"]');
      for (let i = 0; i < hyphen.length; i++) {
        const currentHyphen = hyphen[i];
        currentHyphen.classList.remove('disabled');
      }
      const noHyphen = lettersArray.filter((letter) => {
        return letter !== '-';
      });
      setRoundWordLettersWithoutHyphen(noHyphen);
    } else {
      setRoundWordLettersWithoutHyphen(roundWordLetters);
    }
  };

  /*Com este useEffect, garantimos que a modal só será aberta depois de a 
  pontuação final ter sido enviada para a base de dados.*/
  useEffect(() => {
    const sendScoreToDB = async () => {
      await postScore(id, gameScore);
      setIsScoreModalOpen(true);
    };
    if (postFinalScore) {
      sendScoreToDB();
    }
  }, [postFinalScore]);

  /*Este useEffect dispara as ações que devem acontecer, caso o tempo para o
  jogador escolher uma letra chegue ao final.*/
  useEffect(() => {
    if (timer) {
      if (countDown === 5) {
        timer.classList.add('alert');
      } else if (countDown === 20) {
        timer.classList.remove('alert');
      }
    }

    if (countDown === 0) {
      bell.play();
      x.classList.remove('noShow');
      x.classList.add('bigX');
      mainContent.classList.remove('container');
      mainContent.classList.add('noShow');

      setShortPause(
        setTimeout(() => {
          x.classList.remove('bigX');
          x.classList.add('noShow');
          mainContent.classList.remove('noShow');
          mainContent.classList.add('container');
          bell.pause();
          bell.currentTime = 0;
          handleMistake('');
        }, 1500)
      );
    }
    return () => {
      clearInterval(shortPause);
    };
  }, [countDown]);

  //Esta é a função disparada quando o jogador escolher uma letra.
  const handleLetterChoice = (e) => {
    const element = e.target;
    const chosenLetter = element.id;

    //A função simplifyLetters remove todos os acentos, cedilha e til das letras da palavra.
    const simplifiedRoundWordLetters = simplifyLetters(roundWordLetters);

    if (
      !element.className.includes('out') &&
      !element.className.includes('remaining')
    ) {
      if (simplifiedRoundWordLetters.includes(chosenLetter)) {
        const selector = defineSelector(chosenLetter);
        const chosenLetterInHTML = document.querySelectorAll(selector);
        let newCount = lettersCount;

        dispatch(changeGameScore(50));
        for (let i = 0; i < chosenLetterInHTML.length; i++) {
          const currentLetter = chosenLetterInHTML[i];
          currentLetter.classList.remove('disabled');
          newCount += 1;
        }

        //Esta condicional identifica se a palavra está completa e, portanto, o jogador venceu.
        if (newCount === simplifiedRoundWordLetters.length) {
          clearInterval(timeInterval);
          if (hangImage.src === '/forcas/forca_0.png') {
            dispatch(changeGameScore(100));
          }
          messageParagraph.textContent = 'PARABÉNS!! VOCÊ GANHOU!';
          disableLetters(generalLettersArray, chosenLetter);
          setPostFinalScore(true);
          setIsDisabled(false);
          timerDiv.classList.remove('timerDiv');
          timerDiv.classList.add('noShow');
          endGameDiv.classList.remove('noShow');
          endGameDiv.classList.add('endGame');
          claps.play();
        } else {
          setCountDown(20);
        }
        setLettersCount(newCount);
      } else {
        handleMistake(chosenLetter);
      }
      element.classList.add('out');
    } else {
      return;
    }
  };

  /*A tratativa para o caso de a letra escolhida não constar na palavra foi colocada 
  à parte da função anterior, que lida com a escolha de uma letra, porque este bloco
  de código também deverá ser executado caso o jogador não escolha nenhuma letra,
  mas acabe seu tempo limite para a escolha de uma letra (o countDown) */
  const handleMistake = (chosenLetter) => {
    dispatch(changeGameScore(-10));

    const currentImageNumber = Number(hangImage.title);
    const nextNumber = currentImageNumber + 1;
    hangImage.src = `/forcas/forca_${nextNumber}.png`;
    hangImage.title = nextNumber;

    /*Esta condicional identifica se chegamos à imagem final, com o enforcado,
    o que significa que o jogo acabou e o jogador perdeu.*/
    let limitNumber;
    if (window.location.href.split('/')[3] === 'single-player') {
      if (window.location.href.split('/').pop() === 'expert') {
        limitNumber = 5;
      } else {
        limitNumber = 8;
      }
    } else {
      limitNumber = 8;
    }

    if (currentImageNumber === limitNumber) {
      clearInterval(timeInterval);
      dispatch(resetGameScore());
      messageParagraph.textContent = 'GAME OVER! VOCÊ PERDEU!';
      setIsDisabled(false);
      setPostFinalScore(true);
      awnSound.play();
      timerDiv.classList.remove('timerDiv');
      timerDiv.classList.add('noShow');
      endGameDiv.classList.remove('noShow');
      endGameDiv.classList.add('endGame');

      for (let i = 0; i < roundWordLettersWithoutHyphen.length; i++) {
        const letter = roundWordLettersWithoutHyphen[i];
        const wordLettersInHTML = document.querySelectorAll(`[alt=${letter}]`);

        if (wordLettersInHTML[0].className.includes('disabled')) {
          for (let i = 0; i < wordLettersInHTML.length; i++) {
            const letterElement = wordLettersInHTML[i];
            letterElement.classList.remove('disabled');
            letterElement.classList.add('remaining');
          }
        }
      }
      disableLetters(generalLettersArray, chosenLetter);
    } else {
      setCountDown(20);
    }
  };

  const handlePlayAgain = () => {
    clearInterval(timeInterval);
    history.push('/');
  };

  const closeModal = () => {
    dispatch(resetGameScore());
    setIsScoreModalOpen(false);
  };

  return (
    <>
      <audio id="erro" src="/erro.m4a" type="audio/m4a" />
      <audio id="aplausos" src="/aplausos.m4a" type="audio/m4a" />
      <audio id="awn" src="/awn.m4a" type="audio/m4a" />
      <section className="allLetters">
        {generalLettersArray.map((letter, i) => {
          return (
            <img
              key={0 + letter + i}
              id={letter}
              className="shadow-lg lettersToChoose"
              src={`/letras/${letter}.png`}
              alt="letra"
              type="image/png"
              onClick={handleLetterChoice}
              onMouseEnter={(e) => e.target.classList.remove('shadow-lg')}
              onMouseLeave={(e) => e.target.classList.add('shadow-lg')}
            />
          );
        })}
      </section>
      <h1 id="bigX" className="noShow">
        X
      </h1>
      <main id="main" className="container">
        <img
          src="/forcas/forca_0.png"
          className="hang"
          title={0}
          alt="forca"
          type="image/png"
        />
        <section className="secondColumn">
          <div id="timerDiv" className="timerDiv">
            <p className="timeMessage">Tempo para escolher a próxima letra:</p>
            <p className="countDownParagraph">{countDown}</p>
          </div>
          <div id="endGame" className="noShow">
            <p className="message" id="message"></p>
            <div className="endButtonsDiv">
              <button
                className="btn viewScoreButton"
                type="button"
                disabled={isDisabled}
                onClick={() => setIsScoreModalOpen(true)}
              >
                <i className="bi-award-fill"></i>
                <p>PONTUAÇÃO</p>
              </button>
              <button
                className="btn playAgainButton"
                type="button"
                disabled={isDisabled}
                onClick={handlePlayAgain}
              >
                <i className="bi-arrow-clockwise"></i>
                JOGAR <p>NOVAMENTE!</p>
              </button>
            </div>
          </div>
          <div className="dashes">
            {roundWordLetters.map((letter, i) => {
              return (
                <div key={0 + letter + i} className="letterDashPair">
                  <img
                    src={`/letras/${letter}.png`}
                    className="disabled gameLetter"
                    alt={letter}
                    type="image/png"
                  />
                  <img
                    key={1 + letter + i}
                    src="/forcas/dash.png"
                    alt="dash"
                    type="image/png"
                    className="dash"
                  />
                </div>
              );
            })}
          </div>
        </section>
        {isScoreModalOpen && (
          <ScoreModal
            source={false}
            message="SUA PONTUAÇÃO É:"
            closeModal={closeModal}
          />
        )}
      </main>
    </>
  );
}
