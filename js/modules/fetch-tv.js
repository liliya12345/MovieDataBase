
import {
  clearError,
  DEFAULT_PARAMS,
  showLoading,
  totalPages,
  currentPage,
  TV_URL,
  applyFilters, currentFilters, showError,hideLoading
} from "../app.js";
import {renderTv} from "./render-tv.js";

let tv;
async function fetchTv(page = 1) {
  try {
    showLoading();
    clearError();

    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page: page,
      vote_count: JSON.stringify(DEFAULT_PARAMS.vote_count)
    });

    const url = `${TV_URL}?${params.toString()}&query=${encodeURIComponent(currentFilters.search.toLowerCase())}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    tv = data.results;
    console.log(tv);
    totalPages = data.total_pages;
    currentPage = data.page;
    applyFilters();
    renderTv();
    hideLoading();


  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}
export {fetchTv,tv}
