const simplifyLetters = (array) => {
  let simplifiedArray = array.map((letter) => {
    if (letter === 'ã' || letter === 'á' || letter === 'â') {
      return 'a';
    } else if (letter === 'ô' || letter === 'ó' || letter === 'õ') {
      return 'o';
    } else if (letter === 'í') {
      return 'i';
    } else if (letter === 'é' || letter === 'ê') {
      return 'e';
    } else if (letter === 'ú') {
      return 'u';
    } else if (letter === 'ç') {
      return 'c';
    } else {
      return letter;
    }
  });
  simplifiedArray = simplifiedArray.filter((letter) => {
    return letter !== '-';
  });

  return simplifiedArray;
};

const defineSelector = (chosenLetter) => {
  let selector;
  if (chosenLetter === 'a') {
    selector = '[alt="a"], [alt="á"], [alt="â"], [alt="ã"]';
  } else if (chosenLetter === 'e') {
    selector = '[alt="e"], [alt="é"], [alt="ê"]';
  } else if (chosenLetter === 'i') {
    selector = '[alt="i"], [alt="í"]';
  } else if (chosenLetter === 'o') {
    selector = '[alt="o"], [alt="ó"], [alt="ô"], [alt="õ"]';
  } else if (chosenLetter === 'u') {
    selector = '[alt="u"], [alt="ú"]';
  } else if (chosenLetter === 'c') {
    selector = '[alt="c"], [alt="ç"]';
  } else {
    selector = `[alt=${chosenLetter}]`;
  }
  return selector;
};

const disableLetters = (array, chosenLetter) => {
  for (let i = 0; i < array.length; i++) {
    const selectionLetter = array[i];
    const selectionLetterElement = document.getElementById(selectionLetter);
    if (
      !selectionLetterElement.className.includes('out') &&
      selectionLetterElement.id !== chosenLetter
    ) {
      selectionLetterElement.classList.add('remaining');
    }
  }
};

const generalLettersArray = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const allLettersArray = [
  'a',
  'á',
  'â',
  'ã',
  'b',
  'c',
  'ç',
  'd',
  'e',
  'é',
  'ê',
  'f',
  'g',
  'h',
  'i',
  'í',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'ó',
  'ô',
  '˜õ',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'ú',
  'v',
  'w',
  'x',
  'y',
  'z',
];

export {
  simplifyLetters,
  defineSelector,
  disableLetters,
  generalLettersArray,
  allLettersArray,
};
