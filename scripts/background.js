// Summarize the article using the OpenAI API
async function summarize(articleText) {
    // Set up the API request
    const requestHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer <your_openai_api_key>"
    });
  
    const requestBody = JSON.stringify({
        "model": "text-davinci-003",
      "prompt": `Please summarize the following article:\n\n${articleText}\n\nSummary:`,
      "temperature": 0.7,
      "max_tokens": 256,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    });
  
    const requestOptions = {
      method: 'POST',
      headers: requestHeaders,
      body: requestBody,
      redirect: 'follow'
    };
  
    // Send the API request
    const response = await fetch("https://api.openai.com/v1/completions", requestOptions);
    const jsonResponse = await response.json();

    console.log(jsonResponse);
  
    // Extract the summary from the API response
    const summary = jsonResponse.choices[0].text.trim();
    console.log("summary: " , summary);
    return summary;
  }
  
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
  