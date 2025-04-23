async function fetchTv(page = 1) {
  try {
    showLoading();
    clearError();

    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page: page,
      vote_count: JSON.stringify(DEFAULT_PARAMS.vote_count)
    });

    const url = `${TV_URL}?${params.toString()}&query=${encodeURIComponent(currentFilters.search.toLowerCase())}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    tv = data.results;
    console.log(tv);
    totalPages = data.total_pages;
    currentPage = data.page;
    applyFilters();
    renderTv();
    hideLoading();


  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}
