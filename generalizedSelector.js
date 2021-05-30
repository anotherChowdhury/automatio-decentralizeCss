/*
decentralizeCss(`h2.heading--2eONR.heading-2--1OnX8.title--3yncE.block--3v-Ow`)
// h2[class*="heading--"][class*="heading-2--"][class*="title--"][class*="block--"]

decentralizeCss(`[class="actions--3vB_X nextButton--25Tal gtm-next-page"] div`)
// [class*="actions--"][class*="nextButton--"][class*="gtm-next-page"] div

decentralizeCss(`.css-ntxj49 [class="css-8buua1-Typeahead"]`)
// [class*="css-"] [class*="css-"][class*="-Typeahead"]

decentralizeCss(`div.css-18eqh53-Input > input#downshift-0-input`)
// div[class*="css-"][class*="-Input"] > input[id^="downshift-"][id$="-input"]

decentralizeCss(`[id="downshift-0-input"]`)
// input[id^="downshift-"][id$="-input"]

*/

const { cursorTo } = require('readline')

const selectorSymbol = {
  class: '*',
  id: '^',
  idLast: '$'
}

const htmlTagSet = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'ul', 'li', 'body', 'input', 'button'])

function isRandom(str) {
  if (!str || str.length == 1) return true
  let regex = ''

  if (str.length == 2) regex = new RegExp('\\d[a-z|A-Z]|[a-z|A-Z]\\d|[a-z][A-Z]|[A-Z][a-z]')
  else regex = new RegExp('\\d[a-z|A-Z]|[a-z|A-Z]\\d')
  // it is a random string if two consecutive string is a mix of number,uppercase,lowercase
  let test = false

  for (let i = 0; i < str.length - 1; i++) {
    const curr = str[i] + str[i + 1]
    test = regex.test(curr)
    if (test) break
  }
  return test
}

// const decentralizeCss = (cssPath) => {
//   let generalizedCss = ''
//   let idx = cssPath.length - 1
//   let currentWord = ''
//   while (idx >= 0) {
//     console.log(currentWord)
//     const currentCharacter = cssPath[idx]
//     if (!symbolToWords[currentCharacter]) {
//       if (['-',']',"="].includes(currentCharacter)) {
//         if (isRandom(currentWord)) currentWord = ''
//       }
//       currentWord = currentCharacter + currentWord
//     } else {
//       generalizedCss = `[${symbolToWords[currentCharacter]}*="${currentWord}"]` + generalizedCss
//       currentWord = ''
//     }

//     if (htmlTagSet.has(currentWord)) {
//       generalizedCss = currentWord + generalizedCss
//       currentWord = ''
//     }
//     idx--
//   }

//   return generalizedCss
// }

// second approach

// [class="actions--3vB_X nextButton--25Tal gtm-next-page"] div

// const decentralizeCss = (cssPath) => {
//   let genericCss = ''
//   let cssPathList = ''
//   const classSelectionExists = cssPath.indexOf(']')
//   if (classSelectionExists > -1) {
//     const opening = cssPath.indexOf('[')
//     opening < classSelectionExists ? (cssPathList = cssPath.split('[')) : (cssPathList = cssPath.split(']'))
//     console.log(cssPathList)
//   } else cssPathList = cssPath.split(' ')

//   for (const path of cssPathList) {
//     const a = getGeneralizedCss(path)
//     console.log(a)
//     genericCss += a
//   }
//   console.log(genericCss)
//   return genericCss
// }

// const getGeneralizedCss = (str, tag = '') => {
//   let genericCss = ''
//   //[class="actions--3vB_X nextButton--25Tal gtm-next-page"]
//   if (str[0] == '[') return handleGeneralizedSelector(str)
//   else if (str.indexOf('.') > -1) return handleClassSelector(str)
//   else if (str.indexOf('#') > -1) return handleIdSelector(str)
// else {
//   const nameList = str.split('-')
//   let currentAttributeName = ''
//   for (let idx = 0; idx < nameList.length; idx++) {
//     const name = nameList[idx].replace('"').trim()

//     if (htmlTagSet.has(name)) {
//       console.log(name)
//       if (!genericCss) genericCss += ' ' + name
//       else genericCss += name
//     } else if (!isRandom(name)) {
//       if (idx + 1 <= nameList.length - 1) {
//         if (!nameList[idx + 1]) currentAttributeName += `${name}--`
//         else currentAttributeName += `${name}-`
//       } else {
//         if (!currentAttributeName) currentAttributeName = '-' + name
//         else currentAttributeName += name
//       }
//     } else {
//       if (currentAttributeName) genericCss += `[${tag}${symbolToWords[tag]}="${currentAttributeName}"]`
//       currentAttributeName = ''
//     }
//   }
//   if (currentAttributeName) genericCss += `[${tag}${symbolToWords[tag]}="${currentAttributeName}"]`
//   return genericCss
// }
// }

// const handleGeneralizedSelector = (str) => {
//   str = str.substring(1, str.length)
//   let genericCss = ''
//   const pathList = str.split('=')
//   const tag = pathList[0]
//   const selectorList = pathList[pathList.length - 1].split(' ')
//   selectorList.forEach((element) => {
//     element = element.replace('"', '')
//     genericCss += getGeneralizedCss(element, tag)
//   })
//   console.log(genericCss)
//   return genericCss
// }

// const handleClassSelector = (str) => {
//   let genericCss = ''
//   const selectorList = str.split('.')
//   selectorList.forEach((element) => (genericCss += getGeneralizedCss(element, 'class')))
//   return genericCss
// }

// const handleIdSelector = (str) => {
//   let genericCss = ''
//   const selectorList = str.split('#')
//   selectorList.forEach((element, idx) => (genericCss += getGeneralizedCss(element, 'id')))
//   return genericCss
// }

// decentralizeCss('.css-ntxj49 [class="css-8buua1-Typeahead"]')

function decentralizeCss(cssPath) {
  cssPath = cssPath.trim()
  let genericCss = ''
  let tag = ''
  let selector = ''
  let attributes = ''
  let currentWord = ''

  const resetData = () => {
    attributes = ''
    tag = ''
    selector = ''
    currentWord = ''
  }

  const getCss = () => {
    if (selector && attributes) {
      genericCss += getGeneralziedCss({ tag, selector, attributes })
      resetData()
    }
  }

  for (let i = 0; i < cssPath.length; i++) {
    const char = cssPath[i]
    switch (char) {
      case '.':
        attributes = currentWord
        getCss()
        selector = 'class'
        if (htmlTagSet.has(currentWord)) {
          tag = currentWord
          currentWord = ''
          attributes = ''
        }

        break
      case '#':
        attributes = currentWord
        getCss()
        selector = 'id'
        if (htmlTagSet.has(currentWord)) {
          tag = currentWord
          currentWord = ''
          attributes = ''
        }
        break
      case '[':
        getCss()
        break
      case '"':
        break
      case '=':
        currentWord = currentWord.replace('"', '')
        selector = currentWord
        currentWord = ''
        break
      case '<':
      case '>':
        getCss()
        genericCss += ' ' + char + ' '
      case ']':
        if (attributes) attributes += ' ' + currentWord
        else attributes = currentWord

        getCss()
        break
      default:
        currentWord += char
    }
  }

  currentWord = currentWord.trim()
  if (htmlTagSet.has(currentWord.trim())) genericCss += ' ' + currentWord
  else if (selector && currentWord) {
    genericCss += getGeneralziedCss({ tag, selector, attributes: currentWord })
  } else {
    genericCss += currentWord
  }

  console.log(genericCss)
  console.log(`Input ${cssPath}`)
}

function getGeneralziedCss({ tag, selector, attributes }) {
  console.log(attributes)
  let genericCss = tag
  const attributeList = attributes.split(' ')
  attributeList.forEach((attribute) => {
    genericCss += getGeneralizedAttributes({ selector, attribute })
  })

  return genericCss
}

/*
decentralizeCss(`h2.heading--2eONR.heading-2--1OnX8.title--3yncE.block--3v-Ow`)
// h2[class*="heading--"][class*="heading-2--"][class*="title--"][class*="block--"]

decentralizeCss(`[class="actions--3vB_X nextButton--25Tal gtm-next-page"] div`)
// [class*="actions--"][class*="nextButton--"][class*="gtm-next-page"] div
 */

const getGeneralizedAttributes = ({ tag, selector, attribute }) => {
  let genericCss = ''
  let nameList = attribute.split('-')

  let currentAttributeName = ''
  let last = ''
  for (let idx = 0; idx < nameList.length; idx++) {
    if (selector == 'id' && idx == nameList.length - 1) last = 'Last'
    const name = nameList[idx].replace('"').trim()

    if (!isRandom(name)) {
      if (idx + 1 <= nameList.length - 1) {
        if (!nameList[idx + 1]) currentAttributeName += `${name}--`
        else currentAttributeName += `${name}-`
      } else {
        if (!currentAttributeName) currentAttributeName = '-' + name
        else currentAttributeName += name
      }
    } else {
      if (name.length == 1 && idx + 1 <= nameList.length - 1 && !nameList[idx + 1]) currentAttributeName += `${name}--`
      else if (currentAttributeName) {
        genericCss += `[${selector}${selectorSymbol[selector]}="${currentAttributeName}"]`
        currentAttributeName = ''
      }
    }
  }
  if (currentAttributeName)
    genericCss += `[${selector}${
      selectorSymbol[selector + last] ? selectorSymbol[selector + last] : ''
    }="${currentAttributeName}"]`

  return genericCss
}

decentralizeCss(`[aria-label="next page"] a > div:nth-of-type(1)`)
