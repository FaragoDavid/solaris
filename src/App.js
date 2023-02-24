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
function getHunLetters(word) {
  const DIGRAPHS = ['cs', 'dz', 'gy', 'ly', 'ny', 'sz', 'ty', 'zs'];
  const TRIGRAPH = 'dzs';

  const result = [];

  for (let index = 0; index < word.length; index++) {
    if (word.substring(index, index + 3) === TRIGRAPH) {
      result.push(word.substring(index, index + 3));
      index += 2;
    } else if (DIGRAPHS.includes(word.substring(index, index + 2))) {
      result.push(word.substring(index, index + 2));
      index++;
    } else {
      result.push(word[index]);
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

function drawWord(word, context) {
  getHunLetters(word).forEach((letter, index, letters) => {
    const image = new Image();
    image.src = `${process.env.PUBLIC_URL}/letters/${getImgSrc(letter)}.svg`;
    image.onload = drawLetterImage(context, image, index, letters);
  });
}

function App() {
  const myCanvas = useRef();
  const [word, setWord] = useState('');

  useEffect(() => {
    const context = myCanvas.current.getContext('2d');
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawWord(word, context);
  }, [word]);

  return (
    <div>
      <div>
        <input onChange={({ target: { value } }) => setWord(value.toLowerCase())} />
      </div>
      <div>
        <canvas ref={myCanvas} height={CANVAS_SIZE} width={CANVAS_SIZE} />
      </div>
    </div>
  );
}

export default App;
