import {renderMovies} from "./renderMovies.js";
import {applyFilters, BASE_URL, clearError, DEFAULT_PARAMS, hideLoading, showError, showLoading} from "../app.js";

let all;
let totalPages ;
let currentPage;

async function fetchData(page = 1) {
  try {
    showLoading();
    clearError();

    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page: page,
      vote_count: JSON.stringify(DEFAULT_PARAMS.vote_count)
    });

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
    hideLoading();

  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}
export {fetchData,all}
