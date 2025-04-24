
import {renderActorMovies} from "./render-actor.js"
import {actorId,  API_KEY, hideLoading, showError, showLoading} from "../actor.js";

let actorMovies;

async function fetchActorMovies() {

  try {
    showLoading();

    const response = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    actorMovies = data.cast;
    console.log(actorMovies);

    renderActorMovies();
    hideLoading();

  } catch (error) {
    console.error('Error fetching actor movies:', error);
    showError('Failed to load actor filmography');
    hideLoading();
  }
}
export {fetchActorMovies,actorMovies}
