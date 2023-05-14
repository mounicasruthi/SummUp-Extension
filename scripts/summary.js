// const summaryContainer = document.getElementById('summary-container');
// const summaryParagraph = document.createElement('p');
// summaryParagraph.textContent = summary;
// summaryContainer.appendChild(summaryParagraph);

const summary = decodeURIComponent(location.search.substr(1));
document.getElementById('summary').textContent = summary;
