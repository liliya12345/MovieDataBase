import {
  applyFilters,
  clearError,
  currentFilters,
  DEFAULT_PARAMS,
  hideLoading,
  MOVIE_URL,
  showError,
  showLoading
} from "../app.js";
import {renderSearchMovies} from "./renderSearchMovies.js";


let searchMovie;
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
    // let totalPages = data.total_pages;
    // let  currentPage = data.page;


    applyFilters();
    renderSearchMovies()


    hideLoading();
  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}
export {fetchSearchData,searchMovie}
