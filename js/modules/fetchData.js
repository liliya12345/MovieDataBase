
import {
  applyFilters,
  BASE_URL,
  clearError,
  DEFAULT_PARAMS,
  hideLoading,
  showError,
  showLoading, topContainer
} from "../app.js";
import {Movie} from "../Movie.js";



let all;
let tops=[];
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

    all.forEach(popMovie => {
        const top = new Movie();
        top.title = popMovie.title;
        top.id = popMovie.id;
        top.adult = popMovie.adult;
        top.backdrop_path = popMovie.backdrop_path;
        top.genre_ids = popMovie.genre_ids;
        top.original_language = popMovie.original_language
        top.original_title = popMovie.original_title
        top.overview = popMovie.overview
        top.popularity = popMovie.popularity
        top.poster_path = popMovie.poster_path
        top.release_date = popMovie.release_date
        top.title = popMovie.title
        top.video = popMovie.video
        top.vote_average = popMovie.vote_average
        top.vote_count = popMovie.vote_count
        tops.push(top);
      }
    )




    applyFilters();
    Movie.renderMovies(tops,topContainer);
    hideLoading();

  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}
export {fetchData,tops}
