
  document.addEventListener('DOMContentLoaded', () => {
  try {
  const movieData = getMovieDataFromURL();
  if (!movieData) return;

  displayBasicMovieInfo(movieData);
  fetchAdditionalDetails(movieData.id);
} catch (error) {
  handleError(error);
}
});

  // Получаем данные фильма из URL
  function getMovieDataFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieDataStr = urlParams.get('data');
  if (!movieDataStr) {
  window.location.href = 'index.html';
  return null;
}
  return JSON.parse(decodeURIComponent(movieDataStr));
}

  // Отображаем основную информацию о фильме
  function displayBasicMovieInfo(movie) {
  // Устанавливаем текст
  document.getElementById('movie-title').textContent = movie.title;
  document.title = `${movie.title} | Movie Details`;
  document.getElementById('movie-overview').textContent = movie.overview || 'No overview available.';
  document.getElementById('movie-year').textContent = getReleaseYear(movie.release_date);
  document.getElementById('movie-rating').textContent = formatRating(movie.vote_average);
  document.getElementById('movie-vote-count').textContent = formatVoteCount(movie.vote_count);

 // Устанавливаем изображения
  setPosterImage(movie.poster_path);
  setBackdropImage(movie.backdrop_path);
}

  // Получаем год релиза
  function getReleaseYear(date) {
  return date ? new Date(date).getFullYear() : 'N/A';
}

  // Форматируем рейтинг
  function formatRating(rating) {
  return rating ? rating.toFixed(1) : 'N/A';
}

  // Форматируем количество голосов
  function formatVoteCount(count) {
  return count ? count.toLocaleString() : '0';
}

  // Устанавливаем постер фильма
  function setPosterImage(posterPath) {
  const posterUrl = posterPath
  ? `https://image.tmdb.org/t/p/w500${posterPath}`
  : 'https://via.placeholder.com/500x750?text=No+Poster';
  document.getElementById('movie-poster').src = posterUrl;
}

  // Устанавливаем фоновое изображение
  function setBackdropImage(backdropPath) {
  if (backdropPath) {
  document.getElementById('movie-backdrop').style.backgroundImage =
  `url(https://image.tmdb.org/t/p/original${backdropPath})`;
}
}

  // Обновляем детали фильма
  function updateMovieDetails(movie) {
  document.getElementById('movie-status').textContent = movie.status || 'N/A';
  document.getElementById('movie-budget').textContent = formatCurrency(movie.budget);
  document.getElementById('movie-revenue').textContent = formatCurrency(movie.revenue);
  displayProductionCompanies(movie.production_companies);
}

  // Форматируем валюту
  function formatCurrency(amount) {
  return amount ? `$${amount.toLocaleString()}` : 'N/A';
}

  // Отображаем компании-производители
  function displayProductionCompanies(companies) {
  const container = document.getElementById('movie-production');
  container.innerHTML = '';

  if (!companies || companies.length === 0) {
  container.textContent = 'No production companies available';
  return;
}

  companies.forEach(company => {
  const p = document.createElement('p');
  p.textContent = company.name;
  container.appendChild(p);
});
}

  // Отображаем актерский состав
  function displayCast(cast) {
  const container = document.getElementById('movie-cast');
  container.innerHTML = '';

  if (!cast || cast.length === 0) {
  container.innerHTML = '<p>No cast information available.</p>';
  return;
}

  cast.slice(0, 10).forEach(person => {
  const col = document.createElement('div');
  col.className = 'col-6 col-sm-4 col-md-3 col-lg-2 cast-member';
  col.innerHTML = createCastMemberHTML(person);
  col.addEventListener('click', () => navigateToActorPage(person));
  container.appendChild(col);
});
}

  // Создаем HTML для участника съемочной группы
  function createCastMemberHTML(person) {
  const photoUrl = person.profile_path
  ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
  : 'https://via.placeholder.com/200x300?text=No+Photo';

  return `
    <img src="${photoUrl}" alt="${person.name}" class="cast-photo img-fluid mb-2">
    <h6>${person.name}</h6>
    <p class="text-muted small">${person.character || 'Unknown'}</p>
  `;
}

  // Переход на страницу актера
  function navigateToActorPage(person) {
  const actorDataStr = encodeURIComponent(JSON.stringify(person));
  window.location.href = `actor.html?data=${actorDataStr}`;
}

  // Обработка ошибок
  function handleError(error) {
  console.error('Error:', error);
  window.location.href = 'index.html';
}
