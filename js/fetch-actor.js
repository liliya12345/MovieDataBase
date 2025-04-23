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
    actorMovies = data.cast || [];
    console.log(data);

    renderActorMovies();
    hideLoading();

  } catch (error) {
    console.error('Error fetching actor movies:', error);
    showError('Failed to load actor filmography');
    hideLoading();
  }
}
