
// Send a message to the content script to get the article text
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { message: "getArticleText" }, (response) => {
    const articleText = response.articleText;

    document.getElementById("summarize-btn").addEventListener("click", () => {
      summarizeArticle(articleText);
    });

    document.getElementById("ask-btn").addEventListener("click", () => {
      getAnswer(articleText);
    });
  });
});

// Send a message to the background script to summarize the article
function summarizeArticle(articleText) {
  chrome.runtime.sendMessage({ message: "summarize", articleText: articleText });
}

// Send a message to the background script to get an answer to the question
function getAnswer(articleText) {
  const questionInput = document.getElementById('question-input');
  const question = questionInput.value;

  chrome.runtime.sendMessage({ message: "answer", articleText: articleText, question: question }, (response) => {
    const answer = response.answer;
    displayAnswer(answer);
  });

  // questionInput.value = '';
}

// Listen for messages from the background script with the summary or answer
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.summary) {
    const summary = request.summary;
    displaySummary(summary);
  } else if (request.answer) {
    const answer = request.answer;
    displayAnswer(answer);
  }
});

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

const displayAnswer = (answer) => {
  const answerContainer = document.createElement("div");
  answerContainer.setAttribute("id", "answer-container");
  answerContainer.style.marginTop = "20px";
  answerContainer.style.padding = "20px";
  answerContainer.style.border = "1px solid #ddd";

  const answerText = document.createElement("p");
  answerText.innerHTML = answer;
  answerText.style.fontSize = "16px";
  answerText.style.lineHeight = "1.4";

  answerContainer.appendChild(answerText);

  const questionForm = document.querySelector('form');
  questionForm.parentNode.insertBefore(answerContainer, questionForm.nextSibling);
};