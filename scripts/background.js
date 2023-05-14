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

  // Answer a question based on the article using the OpenAI API
async function answerQuestion(articleText, question) {
    // Set up the API request
    console.log("hi")
    const requestHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer <your_openai_api_key>"
    });

    console.log(question)
    console.log(articleText)
  
    const requestBody = JSON.stringify({
        "model": "text-davinci-003",
      "prompt": `Here's the content of the webpage: ${articleText}. Based on that, I need you to provide me an answer the following question? ${question}`,
      "temperature": 0.5,
      "max_tokens": 256,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    });

    console.log(requestBody, "umm?")
  
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
  
    // Extract the answer from the API response
    const answer = jsonResponse.choices[0].text.trim();
    return answer;
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
    else if (request.message === "answer") {
      const articleText = request.articleText;
      const question = request.question;

      console.log(question, "outside")
  
      // Call the answerQuestion function
      answerQuestion(articleText, question)
      .then(answer => {
        console.log(question, "inside")
        sendResponse({ answer });
        chrome.runtime.sendMessage({ answer });
      })
      .catch(error => {
        sendResponse({ error: error.message });
      });
  
      return true;
    }
  });