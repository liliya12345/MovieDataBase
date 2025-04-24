import {fetchActorMovies} from "./modules/fetch-actor.js";
import {renderActorMovies} from "./modules/render-actor.js"


const API_KEY = '093bad0ff23dfec0ecf5204b988fe17c';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let actorId;
let actorMovies = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Get actor data from URL
    const urlParams = new URLSearchParams(window.location.search);
    const actorData = JSON.parse(decodeURIComponent(urlParams.get('data')));

    if (!actorData) {
      window.location.href = 'index.html';
      return;
    }

    actorId = actorData.id;

    // Display basic actor info
    displayActorInfo(actorData);

    // Load and display actor's filmography
    await fetchActorMovies();

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('error').textContent = 'Failed to load actor details';
    document.getElementById('error').classList.remove('d-none');
  }
});

function displayActorInfo(actor) {
  document.getElementById('actor-name').textContent = actor.name;
  document.title = `${actor.name} | Actor Details`;


  document.getElementById('actor-popularity').textContent =
    `Popularity: ${actor.popularity?.toFixed(1) || 'N/A'}`;

  document.getElementById('actor-department').textContent =
    ` ${actor.known_for_department}`;

  // Set actor photo
  const photoUrl = actor.profile_path
    ? `${IMAGE_BASE_URL}${actor.profile_path}`
    : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg';

  document.getElementById('actor-poster').src = photoUrl;


}


function showLoading() {
  document.getElementById('loading').classList.remove('d-none');
  document.getElementById('movies-container').classList.add('d-none');
  document.getElementById('no-results').classList.add('d-none');
  document.getElementById('error').classList.add('d-none');
}

function hideLoading() {
  document.getElementById('loading').classList.add('d-none');
  document.getElementById('movies-container').classList.remove('d-none');
}

function showError(message) {
  document.getElementById('error').textContent = message;
  document.getElementById('error').classList.remove('d-none');
}

// Add event listener for sort select
document.getElementById('sort-select').addEventListener('change', renderActorMovies);
export {actorMovies,actorId,API_KEY,IMAGE_BASE_URL,showLoading,hideLoading,showError,displayActorInfo}
