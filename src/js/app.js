import { PROXY, SEARCH_URL, PAGE_URL } from './consts';
import { searchForm, searchList, errorMessage } from './elements';

// Show error message
const displayErrorMessage = () => {
  errorMessage.textContent = 'Please enter some text';
  errorMessage.setAttribute('role', 'alert');
};

// Hide error message
const hideErrorMessage = () => {
  errorMessage.textContent = '';
  errorMessage.removeAttribute('role', 'alert');
};

// Get the data submitted by the user
const getData = ({ target }) => {
  const formData = new FormData(target);
  const inputData = formData.get('input-data');
  if (inputData === '') {
    displayErrorMessage();
  } else {
    hideErrorMessage();
  }
  return inputData;
};

// Generate the url
const generateURL = (e) => {
  const API_URL = `${PROXY}${SEARCH_URL}&srsearch=${getData(e)}`;
  return API_URL;
};

// Fetch the data from the Wikipedia API
const fetchData = async (e) => {
  const url = generateURL(e);
  const res = await fetch(url);
  const data = await res.json();
  const searchResult = data.query.search;
  return searchResult;
};

// Convert the data to HTML
const convertDataToHTML = (data) => {
  const html = data
    .map(
      (item) => `   
        <li>
          <a href=${PAGE_URL}${item.pageid} target="_blank" rel="noopener noreferrer">
            <h2>${item.title}</h2>
            <p>${item.snippet}</p>
          </a>
        </li>`
    )
    .join('');
  return html;
};

// Display the data
const displayData = async (e) => {
  e.preventDefault();
  try {
    const data = await fetchData(e);
    searchList.innerHTML = convertDataToHTML(data);
  } catch (err) {
    console.log(err);
  }
};

searchForm.addEventListener('submit', displayData);
