import {IMAGE_BASE_URL} from "../actor.js";
import {actorMovies} from "./fetch-actor.js";

function navigateToMovie(movie) {
  window.location.href = `film.html?data=${encodeURIComponent(JSON.stringify(movie))}`;
}
function renderActorMovies() {
  const container = document.getElementById('movies-container');
  container.innerHTML = '';

  if (!actorMovies.length) {
    console.log(actorMovies)
    document.getElementById('no-results').classList.remove('d-none');
    return;
  }

  // Сортировка фильмов
  const sortedMovies = sortMovies([...actorMovies], document.getElementById('sort-select').value);

  // Отрисовка фильмов
  container.innerHTML = sortedMovies.map(movie => `
    <div class="col" style="cursor:pointer" onclick="navigateToMovie(${JSON.stringify(movie).replace(/"/g, '&quot;')})">
      <div class="movie-card h-100">
        ${movie.poster_path
    ? `<img src="${IMAGE_BASE_URL}${movie.poster_path}" class="card-img-top movie-poster" alt="${movie.title}" loading="lazy">`
    : `<div class="card-img-top movie-poster poster-placeholder">
               <i class="fas fa-film fa-5x text-muted"></i>
             </div>`
  }
        <div class="card-body">
          <h5 class="card-title">${movie.title || 'Untitled'}</h5>
          <p class="text-muted">${getReleaseYear(movie.release_date)}</p>
          <span class="badge bg-primary">Rating: ${formatRating(movie.vote_average)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Вспомогательные функции
function sortMovies(movies, sortValue) {
  const sortOptions = {
    'popularity.desc': (a, b) => b.popularity - a.popularity,
    'popularity.asc': (a, b) => a.popularity - b.popularity,
    'title.asc': (a, b) => (a.title || '').localeCompare(b.title || ''),
    'title.desc': (a, b) => (b.title || '').localeCompare(a.title || '')
  };
  return movies.sort(sortOptions[sortValue] || sortOptions['popularity.desc']);
}

function getReleaseYear(date) {
  return date ? date.substring(0, 4) : 'N/A';
}

function formatRating(rating) {
  return rating?.toFixed(1) || 'N/A';
}


export {renderActorMovies, getReleaseYear,formatRating,navigateToMovie,sortMovies}
