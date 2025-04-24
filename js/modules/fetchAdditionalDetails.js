import {displayCast} from "../film.js";


async function fetchAdditionalDetails(movieId) {
  try {
    const API_KEY = '093bad0ff23dfec0ecf5204b988fe17c';
    const baseUrl = 'https://api.themoviedb.org/3/movie';

    // Fetch detailed movie info
    const detailsUrl = `${baseUrl}/${movieId}?api_key=${API_KEY}&append_to_response=credits,similar`;
    const response = await fetch(detailsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const data = await response.json();

    // // Update movie details with additional info
    // updateMovieDetails(data);
    //
    // Display cast
    displayCast(data.credits.cast);
    //
    // // Display similar movies
    // displaySimilarMovies(data.similar.results);

  } catch (error) {
    console.error('Error fetching additional details:', error);
  }
}
export {fetchAdditionalDetails};
