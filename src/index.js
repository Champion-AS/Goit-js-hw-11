import './css/styles.css';
import { getPhoto } from './ApiWep';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const moreBtn = document.querySelector('.load-more');

let page = 1;
let searchValue = '';

let lightbox = new SimpleLightbox('.photo-card a', {
  captionDelay: 250,
  captionsData: 'alt',
});

const totalPages = Math.ceil(500 / 40);

formEl.addEventListener('submit', onSubmit);

async function loadMoreCards(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);

  createGalleryMarkup(data.hits);
  if (page === totalPages) {
    moreBtn.classList.add('visually-hidden');
  }
  lightbox.refresh();
}

// window.addEventListener('scroll', () => {
//   const documentRect = document.documentElement.getBoundingClientRect();
//   // console.log(documentRect.bottom)
//   if (documentRect.bottom <= document.documentElement.clientHeight + 150) {
//     page ++;
//     getPhoto(searchValue, page);
//   }
//   doLightbox();
// })

function onSubmit(event) {
  event.preventDefault();

  clearMarkup(galleryEl);

  searchValue = event.currentTarget.elements.searchQuery.value.trim();
  // console.log(event.currentTarget.elements);
  if (!searchValue) {
    Notiflix.Notify.failure('no arg!');
    return;
  }
  mountData(searchValue);
}

function moreBtnClbc() {
  loadMoreCards(searchValue);
}

async function mountData(searchValue) {
  try {
    const data = await getPhoto(searchValue, page);

    moreBtn.removeEventListener('click', moreBtnClbc);

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);

    createGalleryMarkup(data.hits);
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function createGalleryMarkup(cardsArr) {
  const markup = cardsArr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
    <a class='link-img' href=${largeImageURL}><img src=${webformatURL} alt=${tags}  height="80%" loading="lazy"  class="card-img"/></a>
  <div class="info">
    <p class="info-item">
      <b class="info-label">Likes </b><span class="info-span">${likes}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Views </b><span class="info-span">${views}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Comments </b><span class="info-span">${comments}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Downloads </b><span class="info-span">${downloads}</span>
    </p>
  </div>
</div>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup(element) {
  element.innerHTML = '';
}
