
import {clearError, DEFAULT_PARAMS, hideLoadingPop, POP_URL, popContainer, showError, showLoadingPop} from "../app.js";
import {Movie} from "../Movie.js";

let popMovies = [];

let pops = [];


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

    popMovies = data.results;

    console.log(popMovies);




    popMovies.forEach(popMovie => {
      const pop = new Movie();
        pop.title = popMovie.title;
        pop.id = popMovie.id;
        pop.adult = popMovie.adult;
        pop.backdrop_path = popMovie.backdrop_path;
        pop.genre_ids = popMovie.genre_ids;
        pop.original_language = popMovie.original_language
        pop.original_title = popMovie.original_title
        pop.overview = popMovie.overview
        pop.popularity = popMovie.popularity
        pop.poster_path = popMovie.poster_path
        pop.release_date = popMovie.release_date
        pop.title = popMovie.title
        pop.video = popMovie.video
        pop.vote_average = popMovie.vote_average
        pop.vote_count = popMovie.vote_count
        pops.push(pop);
      }
    )
    Movie.renderMovies(popMovies, popContainer);

    console.log(pops)
    hideLoadingPop();


  } catch (error) {
    showError(error.message);
    hideLoadingPop();
  }
}// Fetch movie data from API
export {fetchPopData, pops}
