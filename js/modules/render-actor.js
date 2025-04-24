import {IMAGE_BASE_URL} from "../actor.js";
import {actorMovies} from "./fetch-actor.js";


function renderActorMovies() {
  const container = document.getElementById('movies-container');
  container.innerHTML = '';

  if (!actorMovies.length) {
    console.log(actorMovies);
    document.getElementById('no-results').classList.remove('d-none');
    return;
  }


  const sortedMovies = sortMovies([...actorMovies], document.getElementById('sort-select').value);

  sortedMovies.forEach(movie => {

    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';

    const releaseDate = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 'N/A';

    const voteAverage = movie.vote_average.toFixed(1);

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
                    <div class="movie-card h-100 position-relative">
                        ${posterUrl ?
      `<img src="${posterUrl}" class="movie-poster" alt="${movie.title}" loading="lazy">` :
      `<div class="poster-placeholder"><i class="fas fa-film fa-3x"></i></div>`
    }
                        <div class="vote-average">
                            ${voteAverage}
                        </div>
                        <div class="movie-info">
                            <h5 class="movie-title" title="${movie.title}">${movie.title}</h5>
                            <p class="movie-date">${releaseDate}</p>
                        </div>
                    </div>
                `;
    card.addEventListener('click', () => {
      // Кодируем данные актера для передачи в URL
      const filmDataStr = encodeURIComponent(JSON.stringify(movie));
      // Переходим на страницу актера
      window.location.href = `film.html?data=${filmDataStr}`;
    });

    card.style.cursor = 'pointer'; // М
   container.appendChild(card);
  });





  // container.innerHTML = sortedMovies.map(movie =>
  //   `
  //
  //   <div class="col" style="cursor:pointer" data-movie-id="${movie.id}">
  //     <div class="movie-card h-100">
  //       ${movie.poster_path
  //   ? `<img src="${IMAGE_BASE_URL}${movie.poster_path}" class="card-img-top movie-poster" alt="${movie.title}" loading="lazy">`
  //   : `<div class="card-img-top movie-poster poster-placeholder">
  //              <i class="fas fa-film fa-5x text-muted"></i>
  //            </div>`
  // }
  //       <div class="card-body">
  //         <h5 class="card-title">${movie.title || 'Untitled'}</h5>
  //         <p class="text-muted">${getReleaseYear(movie.release_date)}</p>
  //         <span class="badge bg-primary">Rating: ${formatRating(movie.vote_average)}</span>
  //       </div>
  //     </div>
  //   </div>
  // `
  //
  // ).join('');
  //
  // // Обработка кликов на карточках фильмов
  // container.addEventListener('click', (e) => {
  //   let filmNavigate=e.target.closest('[data-movie-id]');
  //
  //   // window.location.href = `film.html?id=${filmNavigate}`;
  //   window.location.href = `film.html?data=${encodeURIComponent(JSON.stringify(filmNavigate))}`;
  //   // const movieCard = e.target.closest('[data-movie-id]');
  //   // if (movieCard) {
  //   //   const movieId = movieCard.dataset.movieId;
  //   //   const movie = sortedMovies.find(m => m.id.toString() === movieId.toString());
  //   //
  //   //   if (movie) {
  //   //     // Используем sessionStorage для передачи данных
  //   //     sessionStorage.setItem('currentMovie', JSON.stringify(movie));
  //   //     console.log(`film.html?id=${movieId}`);
  //   //     window.location.href = `film.html?id=${movieId}`;
  //   //   }
  //   // }
  // });
}

// Остальные функции остаются без изменений
function sortMovies(movies, sortValue) {
  const sortOptions = {
    'popularity.desc': (a, b) => b.popularity - a.popularity,
    'popularity.asc': (a, b) => a.popularity - b.popularity,
    'title.asc': (a, b) => (a.title || '').localeCompare(b.title || ''),
    'title.desc': (a, b) => (b.title || '').localeCompare(a.title || '')
  };
  return movies.sort(sortOptions[sortValue]);
}

function getReleaseYear(date) {
  return date ? date.substring(0, 4) : 'N/A';
}

function formatRating(rating) {
  return rating?.toFixed(1) || 'N/A';
}

export {renderActorMovies, getReleaseYear, formatRating, sortMovies};
