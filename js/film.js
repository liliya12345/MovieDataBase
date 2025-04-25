import {fetchAdditionalDetails} from "./modules/fetchAdditionalDetails.js";
import {Movie} from "./Movie.js";


document.addEventListener('DOMContentLoaded', () => {
  try {
    const movieData = Movie.getFromURL();
    if (!movieData) return;

    Movie.displayInfo(movieData);
    fetchAdditionalDetails(movieData.id);
  } catch (error) {
    Movie.handleError(error);
  }
});






