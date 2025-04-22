// Configuration
const API_KEY = '093bad0ff23dfec0ecf5204b988fe17c';
const BASE_URL = 'https://api.themoviedb.org/3/discover/movie';
const MOVIE_URL = 'https://api.themoviedb.org/3/search/movie';
const POP_URL = 'https://api.themoviedb.org/3/movie/popular';
const PERSON_URL = 'https://api.themoviedb.org/3/search/person';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_PARAMS = {
  include_adult: false,
  include_video: false,
  language: 'en-US',
  sort_by: 'vote_average.desc',
  without_genres: '99,10755',
  vote_count: {gte: 200},
  api_key: API_KEY
};

// State
let currentPage = 1;
let totalPages = 1;
let all = [];
let popMovie = [];
let searchMovie = [];
let filteredPeople = [];
let filteredMovies = [];
let currentFilters = {
  search: '',
  year: '',
  rating: ''
};

// DOM Elements
const filterSectionPop=document.getElementsByClassName('filter-section-pop');
const filterSectionTop=document.getElementsByClassName('filter-section-top');
const topContainer = document.getElementById('top-container');
const popContainer = document.getElementById('pop-container');
const moviesContainer = document.getElementById('movies-container');
const peopleContainer = document.getElementById('people-container');
const pagination = document.getElementById('pagination');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const noResultsElement = document.getElementById('no-results');
const searchInput = document.getElementById('search-input');
const yearFilter = document.getElementById('year-filter');
const ratingFilter = document.getElementById('rating-filter');

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // First, load movies to get years for filter
    await fetchData();
    renderTopMovies()
    await fetchPopData()
    // Then populate year filter
    populateYearFilter();

    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    showError(error.message);
  }
});

// Fetch movie data from API
async function fetchPopData(page = 1) {
  try {
    showLoadingPop();
    clearError();

    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page: page,
      vote_count: JSON.stringify(DEFAULT_PARAMS.vote_count)
    });


    const url = `${POP_URL}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    popMovie = data.results;
    console.log(popMovie);
   hideLoadingPop();
    renderPopMovies()

  } catch (error) {
    showError(error.message);
    hideLoadingPop();
  }
}// Fetch movie data from API
async function fetchSearchData(page = 1) {
  try {

    showLoading();
    clearError();

    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page: page,
      vote_count: JSON.stringify(DEFAULT_PARAMS.vote_count)
    });

    if (currentFilters.year) {
      params.set('primary_release_year', currentFilters.year);
    }
    if (currentFilters.rating) {
      params.set('vote_average.gte', currentFilters.rating);
    }

    const url = `${MOVIE_URL}?${params.toString()}&query=${encodeURIComponent(currentFilters.search.toLowerCase())}`
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    searchMovie = data.results;
    console.log(searchMovie)
    totalPages = data.total_pages;
    currentPage = data.page;


    applyFilters();
    renderSearchMovies()
    renderPagination();

    hideLoading();
  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}
async function fetchData(page = 1) {
  try {
    showLoading();
    clearError();

    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page: page,
      vote_count: JSON.stringify(DEFAULT_PARAMS.vote_count)
    });

    if (currentFilters.year) {
      params.set('primary_release_year', currentFilters.year);
    }
    if (currentFilters.rating) {
      params.set('vote_average.gte', currentFilters.rating);
    }

    const url = `${BASE_URL}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    all = data.results;
    totalPages = data.total_pages;
    currentPage = data.page;


    applyFilters();
    renderMovies();
    renderPagination();

    hideLoading();
  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}

// Fetch people  from API
async function fetchPeople(page = 1) {
  try {
    // filterSectionPop.innerHTML = '';
    // filterSectionTop.innerHTML = '';

    showLoadingByPeople();
    clearError();

    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page: page,
      vote_count: JSON.stringify(DEFAULT_PARAMS.vote_count)
    });


    const url = `${PERSON_URL}?${params.toString()}&query=${encodeURIComponent(currentFilters.search.toLowerCase())}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    filteredPeople = data.results;
    console.log(filteredPeople);
    totalPages = data.total_pages;
    currentPage = data.page;

    renderPeople();
    renderPagination();
    hideLoadingByPeople();


  } catch (error) {
    showError(error.message);
    hideLoadingByPeople();
  }
}

// Apply search and filters
function applyFilters() {

  filteredMovies = all.filter(movie => {
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

// Render movie cards
function renderMovies() {
  moviesContainer.innerHTML = '';

  filteredMovies.forEach(movie => {
    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : '';

    const releaseDate = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 'N/A';

    const voteAverage = movie.vote_average.toFixed(1);

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
                    <div class="movie-card h-100 position-relative">
                        ${posterUrl ?
      `<img src="${posterUrl}" class="movie-poster" alt="${movie.title}" loading="lazy">` :
      `<div class="poster-placeholder"><i class="fas fa-film fa-3x"></i></div>`
    }
                        <div class="vote-average">
                            ${voteAverage}
                        </div>
                        <div class="movie-info">
                            <h5 class="movie-title" title="${movie.title}">${movie.title}</h5>
                            <p class="movie-date">${releaseDate}</p>
                        </div>
                    </div>
                `;
    card.addEventListener('click', () => {
      // Кодируем данные актера для передачи в URL
      const filmDataStr = encodeURIComponent(JSON.stringify(movie));
      // Переходим на страницу актера
      window.location.href = `film.html?data=${filmDataStr}`;
    });

    card.style.cursor = 'pointer'; // М
    moviesContainer.appendChild(card);
  });
}
function renderSearchMovies() {
  moviesContainer.innerHTML = '';


  searchMovie.forEach(movie => {
    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : '';

    const releaseDate = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 'N/A';

    const voteAverage = movie.vote_average.toFixed(1);

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
                    <div class="movie-card h-100 position-relative">
                        ${posterUrl ?
      `<img src="${posterUrl}" class="movie-poster" alt="${movie.title}" loading="lazy">` :
      `<div class="poster-placeholder"><i class="fas fa-film fa-3x"></i></div>`
    }
                        <div class="vote-average">
                            ${voteAverage}
                        </div>
                        <div class="movie-info">
                            <h5 class="movie-title" title="${movie.title}">${movie.title}</h5>
                            <p class="movie-date">${releaseDate}</p>
                        </div>
                    </div>
                `;
    card.addEventListener('click', () => {
      // Кодируем данные актера для передачи в URL
      const filmDataStr = encodeURIComponent(JSON.stringify(movie));
      // Переходим на страницу актера
      window.location.href = `film.html?data=${filmDataStr}`;
    });

    card.style.cursor = 'pointer'; // М
    moviesContainer.appendChild(card);
  });
}

// Render top cards
function renderTopMovies() {
  // topContainer.innerHTML = '';

  all.forEach(movie => {
    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : '';

    const releaseDate = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 'N/A';

    const voteAverage = movie.vote_average.toFixed(1);

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
                    <div class="movie-card h-100 position-relative">
                        ${posterUrl ?
      `<img src="${posterUrl}" class="movie-poster" alt="${movie.title}" loading="lazy">` :
      `<div class="poster-placeholder"><i class="fas fa-film fa-3x"></i></div>`
    }
                        <div class="vote-average">
                            ${voteAverage}
                        </div>
                        <div class="movie-info">
                            <h5 class="movie-title" title="${movie.title}">${movie.title}</h5>
                            <p class="movie-date">${releaseDate}</p>
                        </div>
                    </div>
                `;
    card.addEventListener('click', () => {
      // Кодируем данные актера для передачи в URL
      const filmDataStr = encodeURIComponent(JSON.stringify(movie));
      // Переходим на страницу актера
      window.location.href = `film.html?data=${filmDataStr}`;
    });

    card.style.cursor = 'pointer'; // М
    topContainer.appendChild(card);
  });
}
// Render top cards
function renderPopMovies() {
  // popContainer.innerHTML = '';

  popMovie.forEach(movie => {
    const posterUrl = movie.poster_path

      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : '';

    const releaseDate = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 'N/A';

    const voteAverage = movie.vote_average.toFixed(1);

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
                    <div class="movie-card h-100 position-relative">
                        ${posterUrl ?
      `<img src="${posterUrl}" class="movie-poster" alt="${movie.title}" loading="lazy">` :
      `<div class="poster-placeholder"><i class="fas fa-film fa-3x"></i></div>`
    }
                        <div class="vote-average">
                            ${voteAverage}
                        </div>
                        <div class="movie-info">
                            <h5 class="movie-title" title="${movie.title}">${movie.title}</h5>
                            <p class="movie-date">${releaseDate}</p>
                        </div>
                    </div>
                `;
    card.addEventListener('click', () => {
      // Кодируем данные актера для передачи в URL
      const filmDataStr = encodeURIComponent(JSON.stringify(movie));
      // Переходим на страницу актера
      window.location.href = `film.html?data=${filmDataStr}`;
    });

    card.style.cursor = 'pointer'; // М
    popContainer.appendChild(card);
  });
}

// Render people cards
function renderPeople() {

  peopleContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых результатов

  if (filteredPeople.length === 0) {
    noResultsElement.classList.remove('d-none');
    peopleContainer.classList.add('d-none');
  } else {
    noResultsElement.classList.add('d-none');
    peopleContainer.classList.remove('d-none');
  }

  filteredPeople.forEach(person => {
    const posterUrl = person.profile_path
      ? `${IMAGE_BASE_URL}${person.profile_path}`
      : '';

    const popularity = person.popularity.toFixed(1);

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="movie-card h-100 position-relative">
        ${posterUrl ?
      `<img src="${posterUrl}" class="movie-poster" alt="${person.name}" loading="lazy">` :
      `<div class="poster-placeholder"><i class="fas fa-user fa-3x"></i></div>`
    }
        <div class="vote-average">
          ${popularity}
        </div>
        <div class="movie-info">
          <h5 class="movie-title" title="${person.name}">${person.name}</h5>
        </div>
      </div>
    `;
    peopleContainer.appendChild(card);
    // Добавляем обработчик клика
    card.addEventListener('click', () => {
      // Кодируем данные актера для передачи в URL
      const actorDataStr = encodeURIComponent(JSON.stringify(person));
      // Переходим на страницу актера
      window.location.href = `actor.html?data=${actorDataStr}`;
    });

    card.style.cursor = 'pointer'; // Меняем курсор при наведении
    peopleContainer.appendChild(card);
  });


}

// Render pagination
function renderPagination() {
  pagination.innerHTML = '';

  // Previous button
  const prevLi = createPaginationItem('«', currentPage > 1, () => {
    if (currentPage > 1) {
      currentPage--;
      fetchData(currentPage);

    }
  }, false, 'Previous');
  pagination.appendChild(prevLi);

  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // First page and ellipsis
  if (startPage > 1) {
    const firstLi = createPaginationItem('1', true, () => {
      currentPage = 1;
      fetchData(currentPage);
    });
    pagination.appendChild(firstLi);

    if (startPage > 2) {
      const ellipsisLi = document.createElement('li');
      ellipsisLi.className = 'page-item disabled';
      ellipsisLi.innerHTML = '<span class="page-link">...</span>';
      pagination.appendChild(ellipsisLi);
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageLi = createPaginationItem(i.toString(), true, () => {
      currentPage = i;
      fetchData(currentPage);
    }, i === currentPage);
    pagination.appendChild(pageLi);
  }

  // Last page and ellipsis
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsisLi = document.createElement('li');
      ellipsisLi.className = 'page-item disabled';
      ellipsisLi.innerHTML = '<span class="page-link">...</span>';
      pagination.appendChild(ellipsisLi);
    }

    const lastLi = createPaginationItem(totalPages.toString(), true, () => {
      currentPage = totalPages;
      fetchData(currentPage);
    });
    pagination.appendChild(lastLi);
  }

  // Next button
  const nextLi = createPaginationItem('»', currentPage < totalPages, () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchData(currentPage);
    }
  }, false, 'Next');
  pagination.appendChild(nextLi);
}

// Helper to create pagination item
function createPaginationItem(text, enabled, onClick, isActive = false, ariaLabel = null) {
  const li = document.createElement('li');
  li.className = `page-item ${isActive ? 'active' : ''} ${!enabled ? 'disabled' : ''}`;

  const a = document.createElement('a');
  a.className = 'page-link';
  a.href = '#';
  a.textContent = text;

  if (ariaLabel) {
    a.setAttribute('aria-label', ariaLabel);
  }

  if (enabled) {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      onClick();
    });
  }

  li.appendChild(a);
  return li;
}

// Populate year filter with recent years
function populateYearFilter() {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1900; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Search input
  // searchInput.addEventListener('input', (e) => {
  //   currentFilters.search = e.target.value;
  //   fetchPeople();
  //   applyFilters();
  //   renderMovies();

  searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value.trim();

    if (currentFilters.search === '') {
      // Если поиск пустой, показываем фильмы
      peopleContainer.classList.add('d-none');
      moviesContainer.classList.remove('d-none');

    } else {
      // Если есть поисковый запрос, ищем людей
      moviesContainer.classList.remove('d-none');
      peopleContainer.classList.remove('d-none');

      fetchPeople(currentPage);
      fetchSearchData(currentPage);
    }
  });

  // Year filter
  yearFilter.addEventListener('change', (e) => {
    currentFilters.year = e.target.value;
    currentPage = 1;
    fetchData(currentPage);
  });

  // Rating filter
  ratingFilter.addEventListener('change', (e) => {
    currentFilters.rating = e.target.value;
    currentPage = 1;
    fetchData(currentPage);
  });
}

// UI helper functions
function showLoading() {
  loadingElement.classList.remove('d-none');
  moviesContainer.classList.add('d-none');
  pagination.classList.add('d-none');
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
  pagination.classList.add('d-none');
  noResultsElement.classList.add('d-none');
}

function hideLoading() {
  loadingElement.classList.add('d-none');
  moviesContainer.classList.remove('d-none');
  pagination.classList.remove('d-none');
}

function hideLoadingByPeople() {
  loadingElement.classList.add('d-none');
  peopleContainer.classList.remove('d-none');
  pagination.classList.remove('d-none');
}
function hideLoadingPop() {
  loadingElement.classList.add('d-none');
  popContainer.classList.remove('d-none');
  pagination.classList.remove('d-none');
}

function showError(message) {
  errorElement.textContent = `Error: ${message}`;
  errorElement.classList.remove('d-none');
}

function clearError() {
  errorElement.classList.add('d-none');
}


