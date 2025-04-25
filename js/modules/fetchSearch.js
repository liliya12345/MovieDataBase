import {
  applyFilters,
  clearError,
  currentFilters,
  DEFAULT_PARAMS,
  hideLoading,
  MOVIE_URL, moviesContainer,
  showError,
  showLoading
} from "../app.js";

import {Movie} from "../Movie.js";


let searchMovies = [];

async function fetchSearchData(page = 1) {
  document.getElementById('top-section').style.display = 'none';
  document.getElementById('popular-section').style.display = 'none';
  searchMovies = [];
  try {

    showLoading();
    clearError();

    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page: page,
      vote_count: JSON.stringify(DEFAULT_PARAMS.vote_count)
    });


    const url = `${MOVIE_URL}?${params.toString()}&query=${encodeURIComponent(currentFilters.search.toLowerCase())}`
    const response = await fetch(url); //Loggas först när fetch-promiset är resolved


    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.results.length === 0) {
      moviesContainer.innerHTML = '<div>No movies found for your search.</div>';
      return;
    }

       data.results.forEach(searchMovie => {
         const movie = new Movie();
         movie.title = searchMovie.title;
         movie.id = searchMovie.id;
         movie.adult = searchMovie.adult;
         movie.backdrop_path = searchMovie.backdrop_path;
         movie.genre_ids = searchMovie.genre_ids;
         movie.original_language = searchMovie.original_language
         movie.original_title = searchMovie.original_title
         movie.overview = searchMovie.overview
         movie.popularity = searchMovie.popularity
         movie.poster_path = searchMovie.poster_path
         movie.release_date = searchMovie.release_date
         movie.title = searchMovie.title
         movie.video = searchMovie.video
         movie.vote_average = searchMovie.vote_average
         movie.vote_count = searchMovie.vote_count
         searchMovies.push(movie);
       })



      applyFilters();
      moviesContainer.innerHTML = '';
      Movie.renderMovies(searchMovies, moviesContainer);

      hideLoading();

  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}

export {fetchSearchData, searchMovies}
