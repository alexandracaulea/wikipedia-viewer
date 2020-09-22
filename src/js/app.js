import { sanitize } from 'dompurify';
import { SEARCH_URL, PAGE_URL } from './consts';
import {
  searchForm,
  searchResult,
  errorMessage,
  formLoader,
  searchHeadline,
} from './elements';

// Show loader
const showLoader = () => {
  formLoader.classList.remove('is-hidden');
};

// Remove loader
const hideLoader = () => {
  formLoader.classList.add('is-hidden');
};

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
    hideLoader();
  } else {
    hideErrorMessage();
  }
};

const sanitizeData = (inputData) => sanitize(inputData);

// Get the data submitted by the user
const getData = ({ target }) => {
  const formData = new FormData(target);
  const inputData = formData.get('input-data');
  showLoader();
  const cleanInput = sanitizeData(inputData);
  checkInputRequired(cleanInput);
  return cleanInput;
};

// Generate the url
const generateURL = (e) => {
  const API_URL = `${SEARCH_URL}${getData(e)}`;
  return API_URL;
};

// Fetch the data from the Wikipedia API
const fetchData = async (e) => {
  const url = generateURL(e);
  const res = await fetch(url);
  const data = await res.json();
  const results = data.query.pages;
  const resultsArray = [];
  Object.values(results).forEach((result) =>
    resultsArray.push({
      pageid: result.pageid,
      title: result.title,
      extract: result.extract,
    })
  );
  return resultsArray;
};

// Convert the data to HTML
const convertDataToHTML = (data) => {
  const html = data
    .map(
      (item) => `   
        <li>
          <a href=${PAGE_URL}${item.pageid} target="_blank" rel="noopener noreferrer">
            <h2>${item.title}</h2>
            <p>${item.extract}</p>
            <span class="sr-only">(opens in a new tab)</span>
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
    searchHeadline.classList.remove('is-hidden');
    searchHeadline.textContent = `Results for "${getData(e)}"`;
    searchResult.innerHTML = convertDataToHTML(data);
    hideLoader();
    searchResult.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.log(err);
  }
};

searchForm.addEventListener('submit', displayData);
