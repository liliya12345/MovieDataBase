import {filterSection, IMAGE_BASE_URL, noResultsElement, peopleContainer} from "../app.js";
import {filteredPeople} from "./fetchPeople.js";




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
  const sortedPeople = sortPeople([...filteredPeople], document.getElementById('sort-select').value);

  sortedPeople.forEach(person => {

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
      // redirect to actor page
      window.location.href = `actor.html?data=${actorDataStr}`;
    });

    card.style.cursor = 'pointer'; // Меняем курсор при наведении
    peopleContainer.appendChild(card);
  });


}
function sortPeople(filteredPeople, sortValue) {
  const sortOptions = {
    'popularity.desc': (a, b) => b.popularity - a.popularity,
    'popularity.asc': (a, b) => a.popularity - b.popularity,
    'title.asc': (a, b) => (a.name || '').localeCompare(b.name || ''),
    'title.desc': (a, b) => (b.name || '').localeCompare(a.name || '')
  };
  return filteredPeople.sort(sortOptions[sortValue]);
}
export {renderPeople}
