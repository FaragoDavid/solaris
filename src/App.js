import { useRef, useEffect, useState } from 'react';

const CANVAS_SIZE = 500;

function getImgSrc(letter) {
  const map = {
    á: 'aa',
    é: 'ee',
    í: 'ii',
    ó: 'oo',
    ö: 'ooo',
    ő: 'oooo',
    ú: 'uu',
    ü: 'uuu',
    ű: 'uuuu',
  };

  return map[letter] || letter;
}

/**
 * Splits the input into letters, di- and trigraphs.
 * @param {string} word
 * @returns {Array<string>}
 */
function tokenize(word) {
  const DIGRAPHS = ['cs', 'dz', 'gy', 'ly', 'ny', 'sz', 'ty', 'zs'];
  const TRIGRAPH = 'dzs';

  const letters = word.split('');
  const result = [];

  for (let index = 0; index < letters.length; index++) {
    const letter = letters[index];

    if (index + 2 < letters.length && word.substring(index, index + 3) === TRIGRAPH) {
      result.push(word.substring(index, index + 3));
      index += 2;
    } else if (index + 1 < letters.length && DIGRAPHS.includes(word.substring(index, index + 2))) {
      result.push(word.substring(index, index + 2));
      index++;
    } else {
      result.push(letter);
    }
  }

  return result;
}

function drawLetterImage(context, image, index, letters) {
  const scale = (index + 1) / letters.length;
  const shift = ((letters.length - index - 1) / (letters.length * 2)) * CANVAS_SIZE;

  return () => {
    context.drawImage(image, shift, shift, CANVAS_SIZE * scale, CANVAS_SIZE * scale);
  };
}

function drawLetter(context, letters) {
  return (letter, index) => {
    const imgSrc = `${process.env.PUBLIC_URL}/letters/${getImgSrc(letter)}.svg`;
    const image = new Image();
    image.src = imgSrc;
    image.onload = drawLetterImage(context, image, index, letters);
  };
}

function App() {
  const myCanvas = useRef();
  const [word, setWord] = useState('');

  useEffect(() => {
    const context = myCanvas.current.getContext('2d');
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const letters = tokenize(word);
    letters.forEach(drawLetter(context, letters));
  }, [word]);

  return (
    <div>
      <input onChange={({ target: { value } }) => setWord(value)} />
      <canvas ref={myCanvas} height={CANVAS_SIZE} width={CANVAS_SIZE} />
    </div>
  );
}

export default App;
