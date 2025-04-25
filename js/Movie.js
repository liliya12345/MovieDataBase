

export class Movie {
  constructor({
                adult = false,
                backdrop_path = '',
                genre_ids = [],
                id = 0,
                original_language = '',
                original_title = '',
                overview = '',
                popularity = 0,
                poster_path = '',
                release_date = '',
                title = '',
                video = false,
                vote_average = 0,
                vote_count = 0
              } = {}) {
    this.adult = adult;
    this.backdrop_path = backdrop_path;
    this.genre_ids = genre_ids;
    this.id = id;
    this.original_language = original_language;
    this.original_title = original_title;
    this.overview = overview;
    this.popularity = popularity;
    this.poster_path = poster_path;
    this.release_date = release_date;
    this.title = title;
    this.video = video;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
  }

  // Статический метод для создания экземпляра из данных API
  static fromApiData(apiData) {
    return new Movie(apiData);
  }

  // get info about movie from url
  static getFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieDataStr = urlParams.get('data');
    if (!movieDataStr) {
      window.location.href = 'index.html';
      return null;
    }
    return Movie.fromApiData(JSON.parse(decodeURIComponent(movieDataStr)));
  }

  // display info about movie
  static displayInfo(movie) {
    document.getElementById('movie-title').textContent = movie.title;
    document.title = `${movie.title} | Movie Details`;
    document.getElementById('movie-overview').textContent = movie.overview || 'No overview available.';
    document.getElementById('movie-year').textContent = movie.getReleaseYear();
    document.getElementById('movie-rating').textContent = movie.getFormattedRating();
    document.getElementById('movie-vote-count').textContent = movie.getFormattedVoteCount();

    this.setPosterImage(movie.poster_path);
    this.setBackdropImage(movie.backdrop_path);
  }

  getReleaseYear() {
    return this.release_date ? new Date(this.release_date).getFullYear() : 'N/A';
  }

  getFormattedRating() {
    return this.vote_average = this.vote_average.toFixed(1,1);
  }

  getFormattedVoteCount() {
    return this.vote_count ? this.vote_count.toLocaleString() : '0';
  }

 static  setPosterImage(posterPath) {
   const posterUrl = posterPath
     ? `https://image.tmdb.org/t/p/w500${posterPath}`
     : 'https://via.placeholder.com/500x750?text=No+Poster';
   document.getElementById('movie-poster').src = posterUrl;
  }

  static setBackdropImage(backdrop_path) {
      const backdropElement = document.getElementById('movie-backdrop');
      if (backdropElement) {
        backdropElement.style.backgroundImage =
          `url(https://image.tmdb.org/t/p/original${backdrop_path})`;
      }

  }

  // display actors /cast
static   displayCast(cast) {
    const container = document.getElementById('movie-cast');
  container.innerHTML = '';

  if (!cast || cast.length === 0) {
    container.innerHTML = '<p>No cast information available.</p>';
    return;
  }

  cast.slice(0, 10).forEach(person => {
    const col = document.createElement('div');
    col.className = 'col-6 col-sm-4 col-md-3 col-lg-2 cast-member';
    const photoUrl = person.profile_path
      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
      : 'https://via.placeholder.com/200x300?text=No+Photo';
    col.innerHTML = `
      <div class="col-6 col-sm-4 col-md-3 col-lg-2 cast-member">
        <img src="${photoUrl}" alt="${person.name}" class="cast-photo  mb-2">
        <h6>${person.name}</h6>
        <p class="text-muted small">${person.character || 'Unknown'}</p>
      </div>
    `;
    col.addEventListener('click', () => {const actorDataStr = encodeURIComponent(JSON.stringify(person));
      window.location.href = `actor.html?data=${actorDataStr}`;});


    container.appendChild(col);
  });
  }

  // error message
  static handleError(error) {
    console.error('Error:', error);
    window.location.href = 'index.html';
  }

  //render popular movies i html

  static renderMovies(movies, container, sortValue = 'popularity.desc') {
    if (!container) return;

    const sortedMovies = Movie.sortMovie([...movies], sortValue);
    container.innerHTML = sortedMovies.slice(0, 12).map(movie => `
      <div class="col" style="cursor: pointer;">

        <div class="movie-card h-100 position-relative ">
          ${movie.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                 class="movie-poster" alt="${movie.title}" loading="lazy">`
      : `<div class="poster-placeholder"><i class="fas fa-film fa-3x"></i></div>`
    }
          <div class="vote-average">
            ${movie.vote_average?.toFixed(1) || '0.0'}
          </div>
          <div class="movie-info">
            <h5 class="movie-title" title="${movie.title}">${movie.title}</h5>
            <p class="movie-date">${movie.release_date || 'Unknown'}</p>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.col').forEach((card, index) => {
      card.addEventListener('click', () => {
        const movieDataStr = encodeURIComponent(JSON.stringify(movies[index]));
        window.location.href = `film.html?data=${movieDataStr}`;
      });
    });

  }


  static sortMovie(movies, sortValue) {
    if (!Array.isArray(movies)) return movies;

    const sortOptions = {
      'popularity.desc': (a, b) => b.vote_average - a.vote_average,
      'popularity.asc': (a, b) => a.vote_average - b.vote_average,
      'title.asc': (a, b) => (a.title || '').localeCompare(b.title || ''),
      'title.desc': (a, b) => (b.title || '').localeCompare(a.title || '')
    };

    const sortFunction = sortOptions[sortValue];
    return movies.sort(sortFunction);
  }
}
