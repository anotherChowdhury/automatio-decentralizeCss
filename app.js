const { decentralizeCss } = require('./generalizedSelector');

decentralizeCss(`h2.heading--2eONR.heading-2--1OnX8.title--3yncE.block--3v-Ow`);
// h2[class*="heading--"][class*="heading-2--"][class*="title--"][class*="block--"]

decentralizeCss(`[class="actions--3vB_X nextButton--25Tal gtm-next-page"] div`);
// [class*="actions--"][class*="nextButton--"][class*="gtm-next-page"] div

decentralizeCss(`.css-ntxj49 [class="css-8buua1-Typeahead"]`);
// [class*="css-"] [class*="css-"][class*="-Typeahead"]

decentralizeCss(`div.css-18eqh53-Input > input#downshift-0-input`);
// div[class*="css-"][class*="-Input"] > input[id^="downshift-"][id$="-input"]

decentralizeCss(`[id="downshift-0-input"]`);
// input[id^="downshift-"][id$="-input"]

decentralizeCss('[aria-label="next page"] a > div:nth-of-type(1)');

decentralizeCss('[postid="fa6d086c9f"] .feed-item__likes');
