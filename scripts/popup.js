// // Send a message to the content script to get the article text
// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.tabs.sendMessage(tabs[0].id, { message: "getArticleText" }, (response) => {
//         console.log("hello");
//         //  console.log(response.articleText)
//         // console.log(message);
//       const articleText = response.articleText;
//       summarizeArticle(articleText);
//     });
//   });
//   // console.log("peekabooo")
//   // Send a message to the background script to summarize the article
//   function summarizeArticle(articleText) {
//     console.log("peekabooo")
//     chrome.runtime.sendMessage({ message: "summarize", articleText: articleText });
//   }
  
//   // Listen for messages from the background script with the summary
//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log("do I spot you")
//     if (request.summary) {
//       console.log("received summary: ", request.summary);
//       const summary = request.summary;
//       displaySummary(summary);
//     }
//   });
  
//   // // Display the summary in a new tab
//   // function displaySummary(summary) {
//   //   const summaryUrl = `data:text/html,<html><body><p>${summary}</p></body></html>`;
//   //   window.open(summaryUrl, "_blank");
//   // }
//   // Define the function that displays the summary
// const displaySummary = (summary) => {
//   // Create a new tab with the summary content when the "Summarize" button is clicked
//   const summaryUrl = `data:text/html,<html><body><p>${summary}</p></body></html>`;
//   chrome.tabs.create({ url: summaryUrl });
// };



// Send a message to the content script to get the article text
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { message: "getArticleText" }, (response) => {
    // console.log(response.articleText)
    // console.log(message);
    const articleText = response.articleText;
    document.getElementById("summarize-btn").addEventListener("click", () => {
      summarizeArticle(articleText);
    });
  });
});

// Send a message to the background script to summarize the article
function summarizeArticle(articleText) {
  chrome.runtime.sendMessage({ message: "summarize", articleText: articleText });
}

// Listen for messages from the background script with the summary
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.summary) {
    const summary = request.summary;
    displaySummary(summary);
  }
});

// const displaySummary = (summary) => {
//   // Create a new tab with the summary content when the "Summarize" button is clicked
//   const summaryUrl = `data:text/html,<html><head><title>Summary</title></head><body><p>${summary}</p></body></html>`;
//   chrome.tabs.create({ url: summaryUrl });
// };


const displaySummary = (summary) => {
  // Load the summary page HTML file
  fetch(chrome.runtime.getURL("summary.html"))
    .then(response => response.text())
    .then(html => {
      // Insert the summary content into the page HTML
      const summaryHtml = html.replace("{{summary}}", summary);
      
      // Create a new tab with the summary page
      chrome.tabs.create({ url: "data:text/html;charset=UTF-8," + encodeURIComponent(summaryHtml) });
    })
    .catch(error => console.error(error));
};
