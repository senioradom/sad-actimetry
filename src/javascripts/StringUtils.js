export default class StringUtils {
  static wordWrap(longString, maxChar) {
    if (longString == null) {
      return ' ';
    }

    const sumLengthOfWords = (wordArray) => {
      let out = 0;
      if (wordArray.length !== 0) {
        for (let i = 0; i < wordArray.length; i += 1) {
          const word = wordArray[i];
          out += word.length;
        }
      }

      return out;
    };

    const chunkString = (str, length) => str.match(new RegExp(`.{1,${length}}`, 'g'));

    const splitLongWord = (word, maxChar2) => {
      const out = [];
      if (maxChar2 >= 1) {
        const wordArray = chunkString(word, maxChar2 - 1);
        if (wordArray.length >= 1) {
          for (let i = 0; i < (wordArray.length - 1); i += 1) {
            const piece = `${wordArray[i]}-`;
            out.push(piece);
          }
          out.push(wordArray[wordArray.length - 1]);
        }
      }
      if (out.length === 0) {
        out.push(word);
      }
      return out;
    };

    let splitOut = [[]];
    const splitString = longString.split(' ');
    for (let i = 0; i < splitString.length; i += 1) {
      const word = splitString[i];

      if (word.length > maxChar) {
        const wordPieces = splitLongWord(word, maxChar);
        for (let j = 0; j < wordPieces.length; j += 1) {
          const wordPiece = wordPieces[j];
          splitOut = splitOut.concat([[]]);
          splitOut[splitOut.length - 1] = splitOut[splitOut.length - 1].concat(wordPiece);
        }
      } else {
        if ((sumLengthOfWords(splitOut[splitOut.length - 1]) + word.length + 1) > maxChar) {
          splitOut = splitOut.concat([[]]);
        }

        splitOut[splitOut.length - 1] = splitOut[splitOut.length - 1].concat(word);
      }
    }

    for (let i = 0; i < splitOut.length; i += 1) {
      splitOut[i] = splitOut[i].join(' ');
    }

    return splitOut.join('\n');
  }
}
