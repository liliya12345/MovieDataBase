import {IMAGE_BASE_URL, topContainer} from "../app.js";
import {all} from "./fetchData.js";

function renderTopMovies() {
  // topContainer.innerHTML = '';
  topContainer.innerHTML = ''; // Очищаем контейнер
  const allToShow = all.slice(0, 12);
  allToShow.forEach(movie => {
    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : '';

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
                    <div class="movie-card h-100 position-relative">
                        ${posterUrl ?
      `<img src="${posterUrl}" class="movie-poster" alt="${movie.title}" loading="lazy">` :
      `<div class="poster-placeholder"><i class="fas fa-film fa-3x"></i></div>`
    }
                        <div class="vote-average">
                            ${movie.vote_average}
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
    topContainer.appendChild(card);
  });
}
export {renderTopMovies}
