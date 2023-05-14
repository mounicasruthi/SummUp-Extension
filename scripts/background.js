// require('dotenv').config();

// // Summarize the article using the OpenAI API
// async function summarize(articleText) {
//   console.log("inside summarizeee")
//     // Set up the API request
//     const requestHeaders = new Headers({
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//     });
  
//     const requestBody = JSON.stringify({
//       "model": "text-davinci-002",
//       "prompt": `Please summarize the following article:\n\n${articleText}\n\nSummary:`,
//       "temperature": 0.5,
//       "max_tokens": 50,
//       "n": 1,
//       "stop": ["\n"]
//     });
  
//     const requestOptions = {
//       method: 'POST',
//       headers: requestHeaders,
//       body: requestBody,
//       redirect: 'follow'
//     };
  
//     // Send the API request
//     const response = await fetch("https://api.openai.com/v1/engines/text-davinci-002/completions", requestOptions);
//     const jsonResponse = await response.json();
  
//     // Extract the summary from the API response
//     const summary = jsonResponse.choices[0].text.trim();
//     return summary;
//   }
  
  
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
    return new Promise((resolve, reject) => {
      // Your summarization algorithm goes here...
      // For example, you could use an external summarization API or implement your own summarization algorithm
      
      // Here's a simple example that just extracts the first sentence of the article text as the summary
      const summary = articleText.split('. ')[0];
      
      if (summary) {
        resolve(summary);
      } else {
        reject(new Error('Failed to summarize article'));
      }
    });
  }
  

  
  

