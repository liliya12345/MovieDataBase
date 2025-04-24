function displayActorInfo(actor) {
  document.getElementById('actor-name').textContent = actor.name;
  document.title = `${actor.name} | Actor Details`;


  document.getElementById('actor-popularity').textContent =
    `Popularity: ${actor.popularity?.toFixed(1) || 'N/A'}`;

  document.getElementById('actor-department').textContent =
    `Known for: ${actor.known_for_department || 'Acting'}`;

  // Set actor photo
  const photoUrl = actor.profile_path
    ? `${IMAGE_BASE_URL}${actor.profile_path}`
    : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg';

  document.getElementById('actor-poster').src = photoUrl;


}
