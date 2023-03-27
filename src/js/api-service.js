import axios from 'axios';

export async function fetchGallery(searchQuery, page) {
  const key = '34679822-1c5a5d4931a74610a4cbe01cd';
  const url = 'https://pixabay.com/api/';
  const filter = `&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  return await axios
    .get(`${url}?key=${key}${filter}`)
    .then(responce => responce.data);
}
