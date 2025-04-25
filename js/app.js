
import {fetchTv} from "./modules/fetch-tv.js";
import {fetchSearchData,searchMovies} from "./modules/fetchSearch.js";
import {fetchPeople} from "./modules/fetchPeople.js";
import {fetchPopData} from "./modules/fetchPop.js";
import {fetchData} from "./modules/fetchData.js";
import {renderPeople} from "./modules/renderPeople.js";
import {Movie} from "./Movie.js";



const API_KEY = '093bad0ff23dfec0ecf5204b988fe17c';
const BASE_URL = 'https://api.themoviedb.org/3/movie/top_rated';
const MOVIE_URL = 'https://api.themoviedb.org/3/search/movie';
const POP_URL = 'https://api.themoviedb.org/3/movie/popular';
const PERSON_URL = 'https://api.themoviedb.org/3/search/person';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TV_URL = 'https://api.themoviedb.org/3/search/tv';
const DEFAULT_PARAMS = {
  api_key: API_KEY
};

// State
let currentPage = 1;
let totalPages = 1;
let all = [];
let filteredMovies = [];
let currentFilters = {
  search: ''
};

// DOM Elements
const filterSection=document.getElementsByClassName('filter-section');
const topContainer = document.getElementById('top-container');
const popContainer = document.getElementById('pop-container');
const moviesContainer = document.getElementById('movies-container');
const tvContainer = document.getElementById('tv-container');
const peopleContainer = document.getElementById('people-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const noResultsElement = document.getElementById('no-results');
const searchInput = document.getElementById('search-input');



// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await fetchData();
    await fetchPopData()



    // Set up event listeners
    setupEventListeners();
    if (filterSection.length > 0) {
      filterSection[0].style.display = 'none';
    }
  } catch (error) {
    showError(error.message);
  }
});



// Apply search and filters
function applyFilters() {

  filteredMovies = all.filter(movie => {
    console.log(filteredMovies)
    // Search filter
    const matchesSearch = currentFilters.search === '' ||
      movie.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      (movie.original_title && movie.original_title.toLowerCase().includes(currentFilters.search.toLowerCase()));
    return matchesSearch;
  });

  if (filteredMovies.length === 0 && currentFilters.search === '') {
    noResultsElement.classList.remove('d-none');
    moviesContainer.classList.add('d-none');
  } else {
    noResultsElement.classList.add('d-none');
    moviesContainer.classList.remove('d-none');
  }
}


// Set up event listeners
function setupEventListeners() {

  searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value.trim();
    moviesContainer.innerHTML = '';
    if (currentFilters.search === '') {

      // If the search is empty,  show movies
      popContainer.classList.remove('d-none');
      topContainer.classList.remove('d-none');
      if (filterSection.length > 0) {
        filterSection[0].style.display = 'none';
      }


    } else {
     // If there is a search query,  search for people
      peopleContainer.classList.remove('d-none');
      moviesContainer.classList.remove('d-none');
      popContainer.classList.add('d-none');
      topContainer.classList.add('d-none');
      if (filterSection.length > 0) {
        filterSection[0].style.display = 'block';
      }
      fetchPeople(currentPage)
        .then(() => fetchSearchData(currentPage))
        .then(() => fetchTv(currentPage))
        .catch(error => showError(error.message));
    }
  });


}

// UI helper functions
function showLoading() {
  loadingElement.classList.remove('d-none');
  moviesContainer.classList.add('d-none');
  noResultsElement.classList.add('d-none');
}
function showLoadingPop() {
  loadingElement.classList.remove('d-none');
  popContainer.classList.add('d-none');
  noResultsElement.classList.add('d-none');
}

function showLoadingByPeople() {
  loadingElement.classList.remove('d-none');
  peopleContainer.classList.add('d-none');
  noResultsElement.classList.add('d-none');
}

function hideLoading() {
  loadingElement.classList.add('d-none');
  moviesContainer.classList.remove('d-none');
}

function hideLoadingByPeople() {
  loadingElement.classList.add('d-none');
  peopleContainer.classList.remove('d-none');
}
function hideLoadingPop() {
  loadingElement.classList.add('d-none');
  popContainer.classList.remove('d-none');

}

function showError(message) {
  errorElement.textContent = `Error: ${message}`;
  errorElement.classList.remove('d-none');
}

function clearError() {
  errorElement.classList.add('d-none');
}
document.getElementById('sort-select').addEventListener('change', (e) => {
  const sortValue = e.target.value;

  if (currentFilters.search !== '') {
    moviesContainer.innerHTML = '';
    tvContainer.innerHTML = '';
    peopleContainer.innerHTML = '';
    popContainer.innerHTML = '';
    topContainer.innerHTML = '';
    Movie.renderMovies(searchMovies, moviesContainer, sortValue);
    renderPeople();
  }
});
// document.getElementById('sort-select').addEventListener('change',Movie.renderMovies,renderPeople);
export {showLoading,showLoadingByPeople,POP_URL,showError,hideLoading,clearError,hideLoadingPop,showLoadingPop,hideLoadingByPeople,IMAGE_BASE_URL,DEFAULT_PARAMS,totalPages,currentPage,TV_URL,MOVIE_URL,applyFilters,currentFilters,tvContainer,moviesContainer,filteredMovies,filterSection,peopleContainer,noResultsElement,popContainer,topContainer,BASE_URL,PERSON_URL}

