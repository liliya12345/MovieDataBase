function renderPeople() {

  filterSection.display = 'block';
  peopleContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых результатов

  if (filteredPeople.length === 0) {
    noResultsElement.classList.remove('d-none');
    peopleContainer.classList.add('d-none');
  } else {
    noResultsElement.classList.add('d-none');
    peopleContainer.classList.remove('d-none');
  }

  filteredPeople.forEach(person => {

    const posterUrl = person.profile_path
      ? `${IMAGE_BASE_URL}${person.profile_path}`
      : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg';
    const popularity = person.popularity.toFixed(1);
    const role = person.known_for_department;

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="movie-card h-100 position-relative">
        ${posterUrl ?
      `<img src="${posterUrl}" class="movie-poster" alt="${person.name}" loading="lazy">` :
      `<div class="poster-placeholder"><i class="fas fa-user fa-3x"></i></div>`
    }
        <div class="vote-average">
          ${popularity}
        </div>
        <div class="movie-info">
          <h5 class="movie-title" title="${person.name}">${person.name}</h5>
           <p class="movie-date">${role}</p>
        </div>
      </div>
    `;
    peopleContainer.appendChild(card);
    card.addEventListener('click', () => {
      //js значение в json
      const actorDataStr = encodeURIComponent(JSON.stringify(person));
      // Переходим на страницу актера
      window.location.href = `actor.html?data=${actorDataStr}`;
    });

    card.style.cursor = 'pointer'; // Меняем курсор при наведении
    peopleContainer.appendChild(card);
  });


}
