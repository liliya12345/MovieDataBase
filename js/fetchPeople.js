async function fetchPeople(page = 1) {
  try {
    showLoadingByPeople();
    clearError();

    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page: page,
      vote_count: JSON.stringify(DEFAULT_PARAMS.vote_count)
    });


    const url = `${PERSON_URL}?${params.toString()}&query=${encodeURIComponent(currentFilters.search.toLowerCase())}`;
    // const url = `${INFO_URL}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    filteredPeople = data.results;
    // filteredPeople = data.cast;
    console.log(filteredPeople);
    totalPages = data.total_pages;
    currentPage = data.page;

    renderPeople();
    // renderPagination();
    hideLoadingByPeople();


  } catch (error) {
    showError(error.message);
    hideLoadingByPeople();
  }
}
