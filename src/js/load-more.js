export async function onLoadMoreClick() {
  currentPage += 1;
  currentHits += hits.length;

  if (currentHits === totalHits) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results.",
      {
        timeout: 6000,
      }
    );
    refs.loadMoreBtn.classList.add('is-hidden');
  }
  try {
    const { hits, totalHits } = await fetchGallery(searchQuery, currentPage);
    appendGalleryMarkup(hits);
    lightbox.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearGalleryMarkup();
  }
}
