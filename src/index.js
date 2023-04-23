import './css/styles.css';
import './css/countries-list.css';
import './css/country-info-card.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetch';

const DEBOUNCE_DELAY = 300;

const fieldSearch = document.querySelector('input#search-box');
const listCountries = document.querySelector('.country-list');
const cardCountry = document.querySelector('.country-info');

listCountries.classList.add('country-list-styles-none');

fieldSearch.addEventListener(
  'input',
  debounce(searchCountries, DEBOUNCE_DELAY)
);

function searchCountries(e) {
  const nameCountry = e.target.value.trim();

  if (!nameCountry.length) {
    removeMarkup(listCountries, cardCountry);

    return;
  }

  fetchCountries(nameCountry)
    .then(data => {
      if (data.length > 10) {
        removeMarkup(listCountries, cardCountry);

        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length >= 2) {
        removeMarkup(cardCountry);
        const markup = createListCountriesMarkup(data);
        addMarkup(listCountries, markup);

        return;
      }

      removeMarkup(listCountries);
      const markup = createInfoCountryMarkup(data);
      addMarkup(cardCountry, markup);
    })
    .catch(() => {
      removeMarkup(listCountries, cardCountry);

      Notify.failure('Oops, there is no country with that name');
    });
}

function createListCountriesMarkup(dataCountries) {
  return dataCountries
    .map(
      dataCountry => `
          <li class="country-list-item">
            <div class="country-list-thumb">
              <img class="country-list-img" src="${dataCountry.flags.svg}" alt="${dataCountry.name.official}" />
            </div>
            <p class="country-list-name">${dataCountry.name.official}</p>
          </li>
        `
    )
    .join('');
}

function createInfoCountryMarkup([dataCountry]) {
  return `
          <div class="country-card-box">
            <div class="country-card-thumb">
              <img class="country-card-img" src="${
                dataCountry.flags.svg
              }" alt="${dataCountry.name.official}" />
            </div>
            <h1 class="country-card-title">
              ${dataCountry.name.official}
            </h1>
          </div>
          <ul class="country-card-info-list">
            <li class="country-card-info-list-item">
              <b>Capital: </b>
              ${dataCountry.capital}
            </li>
            <li class="country-card-info-list-item">
              <b>Population: </b>
              ${dataCountry.population}
            </li>
            <li class="country-card-info-list-item">
              <b>Languages: </b>
              ${Object.values(dataCountry.languages).join(', ')}
            </li>
          </ul>
        `;
}

function addMarkup(refEl, markup) {
  refEl.innerHTML = markup;
}

function removeMarkup(...refsEl) {
  refsEl.forEach(refEl => {
    refEl.innerHTML = '';
  });
}
