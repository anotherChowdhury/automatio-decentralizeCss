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
