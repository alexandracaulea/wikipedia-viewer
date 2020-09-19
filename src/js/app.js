import { sanitize } from 'dompurify';
import { PROXY, SEARCH_URL, PAGE_URL } from './consts';
import { searchForm, searchResult, errorMessage } from './elements';

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

// Check for error
const checkInputRequired = (input) => {
  if (input === '') {
    displayErrorMessage();
  } else {
    hideErrorMessage();
  }
};

const sanitizeData = (inputData) => sanitize(inputData);

// Get the data submitted by the user
const getData = ({ target }) => {
  const formData = new FormData(target);
  const inputData = formData.get('input-data');
  const cleanInput = sanitizeData(inputData);
  checkInputRequired(cleanInput);
  return cleanInput;
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
  const result = data.query.search;
  return result;
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
  getData(e);
  try {
    const data = await fetchData(e);
    searchResult.innerHTML = convertDataToHTML(data);
  } catch (err) {
    console.log(err);
  }
};

searchForm.addEventListener('submit', displayData);
