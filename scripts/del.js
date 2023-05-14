// background.js

// Include OpenAI API script
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@openai/api@0.7.1/dist/index.js';
document.head.appendChild(script);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "summarize") {
    const articleText = request.articleText;

    // Call the summarize function
    summarize(articleText)
      .then(summary => {
        sendResponse({ summary });
        chrome.runtime.sendMessage({ summary });
      })
      .catch(error => {
        sendResponse({ error: error.message });
      });

    return true;
  }
});

function summarize(articleText) {
  return new Promise(async (resolve, reject) => {
    try {
      // Split article text into paragraphs
      const paragraphs = articleText.split("\n\n");

      // Filter out small paragraphs and keep only big ones
      const bigParagraphs = paragraphs.filter((para) => para.length > 100);

      // Generate summaries for each big paragraph using OpenAI API
      const openai = new OpenAI(process.env.OPENAI_API_KEY);
      const summaries = await Promise.all(
        bigParagraphs.map(async (para) => {
          const prompt = `Summarize this paragraph: ${para}`;
          const response = await openai.complete({
            engine: "davinci",
            prompt,
            maxTokens: 60,
            n: 1,
            stop: "\n",
          });
          return response.choices[0].text.trim();
        })
      );

      // Join all summaries and return
      const summary = summaries.join("\n\n");

      if (summary) {
        resolve(summary);
      } else {
        reject(new Error('Failed to summarize article'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
