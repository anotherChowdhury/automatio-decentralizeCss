/*

"h2.heading--2eONR.heading-2--1OnX8.title--3yncE.block--3v-Ow"

`h2[class*="heading--"][class*="heading-2--"][class*="title--"][class*="block--"]`

*/

const symbolToWords = {
  '.': 'class',
  '#': 'id'
}

const htmlTagSet = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'ul', 'li', 'body', 'input', 'button'])

function isRandom(str) {
  // it is a random string if two consecutive string is a mix of number,uppercase,lowercase
  let test = false
  for (i = 0; i < str.length - 1; i++) {
    const curr = str[i] + str[i + 1]
    test = /\d[a-z|A-Z]|[a-z|A-Z]\d|[a-z][A-Z]|[A-Z][a-z]/.test(curr)
    if (test) break
  }
  return test
}

const decentralizeCss = (cssPath) => {
  let generalizedCss = ''
  let idx = cssPath.length - 1
  let currentWord = ''
  while (idx >= 0) {
    console.log(currentWord)
    const currentCharacter = cssPath[idx]
    if (!symbolToWords[currentCharacter]) {
      if (currentCharacter == '-') {
        if (isRandom(currentWord)) currentWord = ''
      }
      currentWord = currentCharacter + currentWord
    } else {
      generalizedCss = `[${symbolToWords[currentCharacter]}*="${currentWord}"]` + generalizedCss
      currentWord = ''
    }

    if (htmlTagSet.has(currentWord)) {
      generalizedCss = currentWord + generalizedCss
      currentWord = ''
    }
    idx--
  }

  return generalizedCss
}

console.log(decentralizeCss('h2.heading--2eONR.heading-2--1OnX8.title--3yncE.block--3v-Ow'))
