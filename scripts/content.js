// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script running');
    if (request.message === "getArticleText") {
        console.log("hi")
        const articleText = document.body.innerText;
      sendResponse({ articleText: articleText });
    }
  });

// Listen for messages from the popup
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log('Content script running');
//   if (request.message === "getArticleText") {
//     // Create a script element
//     const script = document.createElement('script');
//     console.log('Loading Readability.js');
//     // Set the source to the Readability.js library
//     script.src = chrome.runtime.getURL('../js/readability.js');

//     // Wait for the script to load
//     script.onload = () => {
//       console.log("are you being called?")
//       // Use Readability.js to extract the main article text from the webpage
//       const doc = document.cloneNode(true);
//       console.log('Readability.js library loaded');
//       const reader = new Readability(doc);
//       const article = reader.parse();
//       console.log('Parsed article:', article);

//       const articleText = article?.textContent ?? "";

//       // Send the article text back to the popup
//       console.log('Extracted article text:', articleText);

//       sendResponse({ articleText: articleText });
//     };

//     // Add the script to the page's DOM
//     document.head.appendChild(script);
//   }
// });


