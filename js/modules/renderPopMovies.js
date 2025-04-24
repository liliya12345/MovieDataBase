import {IMAGE_BASE_URL, popContainer} from "../app.js";
import {popMovie} from "./fetchPop.js";

function renderPopMovies() {
  // popContainer.innerHTML = '';
  popContainer.innerHTML = ''; // Очищаем контейнер
  const popToShow = popMovie.slice(0, 12);
  popToShow.forEach(movie => {
    const posterUrl = movie.poster_path

      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : '';

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
                            <p class="movie-date">${movie.release_date}</p>
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
    popContainer.appendChild(card);
  });
}
export {renderPopMovies}
