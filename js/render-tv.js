function renderTv() {
  tvContainer.innerHTML = '';

  tv.forEach(tv => {
    const posterUrl = tv.poster_path
      ? `${IMAGE_BASE_URL}${tv.poster_path}`
      : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';

    const releaseDate = tv.first_air_date
      ? new Date(tv.first_air_date).getFullYear()
      : 'N/A';

    const voteAverage = tv.vote_average.toFixed(1);

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
                    <div class="movie-card h-100 position-relative">
                        ${posterUrl ?
      `<img src="${posterUrl}" class="movie-poster" alt="${tv.name}" loading="lazy">` :
      `<div class="poster-placeholder"><i class="fas fa-film fa-3x"></i></div>`
    }
                        <div class="vote-average">
                            ${voteAverage}
                        </div>
                        <div class="movie-info">
                            <h5 class="movie-title" title="${tv.name}">${tv.name}</h5>
                            <p class="movie-date">${releaseDate}</p>
                        </div>
                    </div>
                `;
    card.addEventListener('click', () => {
      // Кодируем данные актера для передачи в URL
      const filmDataStr = encodeURIComponent(JSON.stringify(tv));
      // Переходим на страницу актера
      window.location.href = `film.html?data=${filmDataStr}`;
    });

    card.style.cursor = 'pointer'; // М
    tvContainer.appendChild(card);
  });
}
