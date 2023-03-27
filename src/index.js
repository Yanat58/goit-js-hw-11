import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchGallery } from './js/api-service';
import { galleryMarkup } from './js/markup-template';
import { refs } from './js/refs';

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onSearchFormSubmit(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.searchQuery.value;
  currentPage = 1;

  if (searchQuery.trim() === '') {
    Notify.warning(' Please try again.', {
      timeout: 6000,
    });
    return;
  }
  console.log(await fetchGallery(searchQuery, currentPage));

  const { hits, totalHits } = await fetchGallery(searchQuery, currentPage);
  currentHits = hits.length;

  if (totalHits > 40) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
  }

  try {
    if (totalHits > 0) {
      Notify.success(`Hooray! We found ${totalHits} images.`, {
        timeout: 6000,
      });
      clearGalleryMarkup();
      appendGalleryMarkup(hits);
      lightbox.refresh();

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (totalHits === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      clearGalleryMarkup();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          timeout: 6000,
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  const { hits, totalHits } = await fetchGallery(searchQuery, currentPage);
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
    appendGalleryMarkup(hits);
    lightbox.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearGalleryMarkup();
  }
}

function appendGalleryMarkup(hits) {
  refs.galleryBox.insertAdjacentHTML('beforeend', galleryMarkup(hits));
}

function clearGalleryMarkup() {
  refs.galleryBox.innerHTML = '';
}
