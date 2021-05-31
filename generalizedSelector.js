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
  'a',
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
  /*
  This function evaluates every charcter and gets the tag, selector and attributes.
  When it hits a special character such as "square braces",".","#","<",">" it calls the getCss function  
  getCss function checks if selector & attribtues exists if it does, 
  it calls the getGeneralizedCss and then reset the values by calling resetData Function
  */
  cssPath = cssPath.trim();
  let genericCss = '';
  let tag = '';
  let selector = '';
  let attributes = '';
  let currentWord = '';

  const resetData = () => {
    // resting data after adding css
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
        attributes = currentWord.trim();
        getCss();
        selector = 'class';
        if (htmlTagSet.has(currentWord)) {
          tag = currentWord;
          currentWord = '';
          attributes = '';
        }
        break;
      case '#':
        attributes = currentWord.trim();
        getCss();
        selector = 'id';
        if (htmlTagSet.has(currentWord.trim())) {
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
        if (!selector) {
          genericCss += currentWord + char + ' ';
          currentWord = '';
        } else {
          attributes = currentWord;
          getCss();
          genericCss += ' ' + char;
        }
        break;
      case ']':
        if (!selector) {
          genericCss += `[${currentWord}] `;
          currentWord = '';
          break;
        }
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
  /*
  This function takes the tag,selector and attributes.
  breaks down the attributes based on spaces if there is any "-" in the attributes and callls 
  getGeneralizedAttributes forEach attribute. else calls the getGeneralizedAttributes attribute 
  with the whole attributes string,gets the generalized attributes  and add tag if exists and returns te generaliized css 
  */
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
  /*
  This function takes the selector and attributes.breaks down the attributes based on "-" 
  and add them as long as the string is not randmized returns all generalized attributes 
  */
  let genericCss = '';
  let nameList = attribute.split('-');

  if (nameList.length == 1) {
    // if attribute name is like next page which is not random
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
    const symbol = getSeclectorSymbol(selector + last);

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
