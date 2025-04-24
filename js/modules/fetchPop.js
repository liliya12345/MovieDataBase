import {renderPopMovies} from "./renderPopMovies.js";
import {clearError, DEFAULT_PARAMS, hideLoadingPop, POP_URL, showError, showLoadingPop} from "../app.js";
let popMovie;
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
export {fetchPopData,popMovie}
