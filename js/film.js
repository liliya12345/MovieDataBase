import {fetchAdditionalDetails} from "./modules/fetchAdditionalDetails.js";

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


function getMovieDataFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieDataStr = urlParams.get('data');
  if (!movieDataStr) {
    window.location.href = 'index.html';
    return null;
  }
  return JSON.parse(decodeURIComponent(movieDataStr));
}

// display movie info
function displayBasicMovieInfo(movie) {

  document.getElementById('movie-title').textContent = movie.title;
  document.title = `${movie.title} | Movie Details`;
  document.getElementById('movie-overview').textContent = movie.overview || 'No overview available.';
  document.getElementById('movie-year').textContent = getReleaseYear(movie.release_date);
  document.getElementById('movie-rating').textContent = formatRating(movie.vote_average);
  document.getElementById('movie-vote-count').textContent = formatVoteCount(movie.vote_count);

  // set poster
  setPosterImage(movie.poster_path);
  setBackdropImage(movie.backdrop_path);
}

// get ReleaseYear
function getReleaseYear(date) {
  return date ? new Date(date).getFullYear() : 'N/A';
}

// format rating
function formatRating(rating) {
  return rating ? rating.toFixed(1) : 'N/A';
}

// format Vote
function formatVoteCount(count) {
  return count ? count.toLocaleString() : '0';
}

// set poster
function setPosterImage(posterPath) {
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';
  document.getElementById('movie-poster').src = posterUrl;
}

// set backdrop image
function setBackdropImage(backdropPath) {
  if (backdropPath) {
    document.getElementById('movie-backdrop').style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${backdropPath})`;
  }
}


// display actors
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
export {displayCast};
