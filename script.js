const API_KEY = '50951734-f98e6cfe76b799fcfc95f0b1a';
const BASE_URL = 'https://pixabay.com/api/';
const perPage = 12;

let query = '';
let page = 1;

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', loadMore);

async function fetchImages(searchQuery, pageNumber) {
  const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${encodeURIComponent(
    searchQuery
  )}&page=${pageNumber}&per_page=${perPage}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    alert('Error fetching images');
    return [];
  }
}

function createCardMarkup({ webformatURL, largeImageURL, likes, views, comments, downloads }) {
  return `
    <li>
      <div class="photo-card">
        <img src="${webformatURL}" alt="" loading="lazy" />
        <div class="stats">
          <p class="stats-item"><i class="material-icons">thumb_up</i>${likes}</p>
          <p class="stats-item"><i class="material-icons">visibility</i>${views}</p>
          <p class="stats-item"><i class="material-icons">comment</i>${comments}</p>
          <p class="stats-item"><i class="material-icons">cloud_download</i>${downloads}</p>
        </div>
      </div>
    </li>
  `;
}

async function onSearch(e) {
  e.preventDefault();
  query = e.currentTarget.elements.query.value.trim();
  if (!query) return;

  page = 1;
  gallery.innerHTML = '';
  const images = await fetchImages(query, page);
  renderGallery(images);
}

async function loadMore() {
  page += 1;
  const images = await fetchImages(query, page);
  renderGallery(images);
  smoothScroll();
}

function renderGallery(images) {
  const markup = images.map(createCardMarkup).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function smoothScroll() {
  const lastCard = gallery.lastElementChild;
  if (lastCard) {
    lastCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}
