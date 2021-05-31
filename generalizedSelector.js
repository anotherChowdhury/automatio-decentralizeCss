const selectorSymbol = {
  class: '*',
  id: '^',
  idLast: '$',
};

const htmlTagSet = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'div',
  'ul',
  'li',
  'body',
  'input',
  'button',
]);

function isRandom(str) {
  if (!str || str.length == 1) return true;
  let regex = '';

  if (str.length == 2)
    regex = new RegExp('\\d[a-z|A-Z]|[a-z|A-Z]\\d|[a-z][A-Z]|[A-Z][a-z]');
  else regex = new RegExp('\\d[a-z|A-Z]|[a-z|A-Z]\\d');
  // it is a random string if two consecutive string is a mix of number,uppercase,lowercase
  let test = false;

  for (let i = 0; i < str.length - 1; i++) {
    const curr = str[i] + str[i + 1];
    test = regex.test(curr);
    if (test) break;
  }
  return test;
}

function decentralizeCss(cssPath) {
  cssPath = cssPath.trim();
  let genericCss = '';
  let tag = '';
  let selector = '';
  let attributes = '';
  let currentWord = '';

  const resetData = () => {
    attributes = '';
    tag = '';
    selector = '';
    currentWord = '';
  };

  const getCss = () => {
    if (selector && attributes) {
      genericCss += getGeneralizedCss({ tag, selector, attributes });
      resetData();
    }
  };

  for (let i = 0; i < cssPath.length; i++) {
    const char = cssPath[i];
    switch (char) {
      case '.':
        attributes = currentWord;
        getCss();
        selector = 'class';
        if (htmlTagSet.has(currentWord)) {
          tag = currentWord;
          currentWord = '';
          attributes = '';
        }
        break;
      case '#':
        attributes = currentWord;
        getCss();
        selector = 'id';
        if (htmlTagSet.has(currentWord)) {
          tag = currentWord;
          currentWord = '';
          attributes = '';
        }
        break;
      case '[':
        attributes = currentWord;
        getCss();
        break;
      case '"':
        break;
      case '=':
        currentWordList = currentWord.replace('"', '').trim().split(' ');
        if (currentWordList.length == 1) {
          selector = currentWordList[0].trim();
          currentWord = '';
        } else {
          genericCss += currentWordList[0] + ' ';
          selector = currentWordList[currentWordList.length - 1].trim();
          currentWord = '';
        }
        break;
      case '<':
      case '>':
        attributes = currentWord;
        getCss();
        genericCss += ' ' + char + ' ';
        break;
      case ']':
        if (!selector) {
          genericCss += `[${currentWord}] `;
          currentWord = '';
          break;
        }
        console.log(currentWord);
        if (attributes) attributes += ' ' + currentWord;
        else attributes = currentWord;
        getCss();
        break;
      default:
        currentWord += char;
    }
  }

  currentWord = currentWord.trim();
  if (htmlTagSet.has(currentWord.trim())) genericCss += ' ' + currentWord;
  else if (selector && currentWord) {
    genericCss += getGeneralizedCss({ tag, selector, attributes: currentWord });
  } else {
    genericCss += currentWord;
  }

  console.log(`Input ${cssPath}`);
  console.log(`Output ${genericCss}`);
}

function getGeneralizedCss({ tag, selector, attributes }) {
  attributes = attributes.trim();
  let genericCss = tag;
  if (attributes.indexOf('-') > -1) {
    const attributeList = attributes.split(' ');
    attributeList.forEach((attribute) => {
      genericCss += getGeneralizedAttributes({ selector, attribute });
    });
  } else {
    genericCss += getGeneralizedAttributes({ selector, attribute: attributes });
  }

  return genericCss;
}

const getGeneralizedAttributes = ({ selector, attribute }) => {
  let genericCss = '';
  let nameList = attribute.split('-');
  console.log(nameList);

  if (nameList.length == 1) {
    if (!isRandom(nameList[0]))
      return `[${selector}${getSeclectorSymbol(selector)}="${nameList[0]}"]`;
    return '';
  }

  let currentAttributeName = '';
  let last = '';
  for (let idx = 0; idx < nameList.length; idx++) {
    if (selector == 'id' && idx == nameList.length - 1) last = 'Last';
    const name = nameList[idx].replace('"').trim();

    if (!isRandom(name)) {
      if (idx + 1 <= nameList.length - 1) {
        if (!nameList[idx + 1]) currentAttributeName += `${name}--`;
        else currentAttributeName += `${name}-`;
      } else {
        if (!currentAttributeName) currentAttributeName = '-' + name;
        else currentAttributeName += name;
      }
    } else {
      if (
        name.length == 1 &&
        idx + 1 <= nameList.length - 1 &&
        !nameList[idx + 1]
      )
        currentAttributeName += `${name}--`;
      else if (currentAttributeName) {
        const symbol = getSeclectorSymbol(selector);
        genericCss += `[${selector}${symbol}="${currentAttributeName}"]`;
        currentAttributeName = '';
      }
    }
  }
  if (currentAttributeName) {
    const symbol = selectorSymbol[selector + last]
      ? selectorSymbol[selector + last]
      : '';

    genericCss += `[${selector}${symbol}="${currentAttributeName}"]`;
  }
  return genericCss;
};

const getSeclectorSymbol = (selector) => {
  return selectorSymbol[selector] ? selectorSymbol[selector] : '';
};

module.exports = {
  selectorSymbol,
  getGeneralizedAttributes,
  getGeneralizedCss,
  decentralizeCss,
};
