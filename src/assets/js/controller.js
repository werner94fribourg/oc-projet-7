import * as model from './model.js';
import * as view from './view.js';

/**
 * Function used to handle the submission of the search form
 * @param {HTMLDOMElement} input input text containing the search value submitted
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const handleSubmitSearchForm = input => {
  const entry = input.value;
  if (entry.length < 3) {
    input.closest('.search-form').querySelector('.invalid-feedback').innerText =
      'Veuillez entrer au moins 3 caractères !';
    input.classList.toggle('is-invalid');
    return;
  }
  input.blur();
};

/**
 * Function used to handle the text typed by an user in the search form
 * @param {HTMLDOMElement} input input text containing the search value
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const handleSearchFormTextInput = input => {
  const entry = input.value;
  if (entry.length < 3 && document.querySelector('.alert') === null) {
    document.querySelector('.menu-list').innerHTML = '';
    document.querySelectorAll('.dropdown-list').forEach(input => {
      input.innerHTML = '';
      input.style.removeProperty('grid-template-columns');
    });
    return;
  }
  if (entry.length >= 3) {
    input.closest('.search-form').querySelector('.invalid-feedback').innerText =
      '';
    input.classList.remove('is-invalid');
  }
  model
    .getRecipesByMainEntry(entry)
    .then(() => {
      view.renderRecipeList(model.state.matchedRecipes);
      document.querySelectorAll('.dropdown-list').forEach(input => {
        input.style.setProperty('grid-template-columns', 'repeat(3, 1fr)');
      });
      Object.entries(model.state.matchedSubSearch).forEach(entry => {
        const [key, value] = entry;
        view.renderSubSearchList(key, value);
      });
      view.addHandlerDropdownItemClick(handleDropdownItemClick);
    })
    .catch(err => console.error(err));
};

/**
 * Function used to handle the UI behavior when the user clicks on one of the specific buttons (Ingrédients, Appareils and Ustensiles)
 * @param {HTMLDOMElement} btn the dropdown element that was clicked
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const handleDropdownClick = btn => {
  const btnGroup = btn.closest('.btn-group');

  btnGroup
    .querySelector('.dropdown-menu')
    .style.setProperty('transform', 'translate3d(0px, 0px, 0px)');
  btnGroup.style.setProperty(
    'max-width',
    `${
      model.state.mainSearch &&
      document.querySelector('.search-form-input').value.length >= 3
        ? '667'
        : '275'
    }px`
  );
  setTimeout(() => {
    btnGroup.classList.toggle('active');
  }, 50);
};

/**
 * Function used to handle when an user clicks outside the active specific button on the UI : it is used to change the rendering of the button
 * @param {HTMLDOMElement} element the element that was clicked by the user
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const handleOutsideDropdownClick = element => {
  const btnGroup = element.closest('.btn-group.active');
  const active = document.querySelector('.btn-group.active');
  if (!btnGroup && active) {
    active.style.removeProperty('max-width');
    active.classList.remove('active');
    active.querySelector('.dropdown-search').value = '';
  }
};

/**
 * Function used to handle the typing of an user inside one of the specific buttons (Ingrédients, Appareils, Ustensiles)
 * @param {HTMLDOMElement} input input text containing the search value
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const handleDropdownSearch = input => {
  const dropdownList = input
    .closest('.btn-group')
    .querySelector('.dropdown-list');
  const key = input.dataset.key;
  const btnGroup = input.closest('.btn-group');

  btnGroup.style.setProperty(
    'max-width',
    `${input.value === '' && model.state.mainSearch ? '667' : '275'}px`
  );
  dropdownList.style.setProperty(
    'grid-template-columns',
    input.value === '' && model.state.mainSearch ? 'repeat(3, 1fr)' : '1fr'
  );
  dropdownList.querySelectorAll('.dropdown-item').forEach(item => {
    item.dataset[key].toUpperCase().includes(input.value.toUpperCase())
      ? item.style.removeProperty('display')
      : item.style.setProperty('display', 'none');
  });

  if (input.value.length >= 3) input.style.removeProperty('color');
};

/**
 * Function used to handle the expected behavior of rerendering the list of recipes when the user clicks on the close button on a specific tag
 * @param {HTMLDOMElement} btn the close button that was clicked by the user
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const handleCloseAlert = btn => {
  const alert = btn.closest('.alert');
  const key = alert.dataset.key;
  const entry = alert.dataset[key];
  model
    .removeTag(key, entry)
    .then(() => {
      view.renderRecipeList(model.state.matchedRecipes);
      document.querySelectorAll('.dropdown-list').forEach(input => {
        input.style.setProperty('grid-template-columns', '1fr');
      });
      Object.entries(model.state.matchedSubSearch).forEach(entry => {
        const [key, value] = entry;
        view.renderSubSearchList(key, value);
      });
      view.addHandlerDropdownItemClick(handleDropdownItemClick);
    })
    .catch(err => console.error(err));
};

/**
 * Function used to handle the behavior when the user submits a value inside one of the specific search forms (Ingrédients, Appareils, Ustensiles)
 * @param {HTMLDOMElement} input input text containing the searched value
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const handleSubmitDropdownForm = input => {
  const key = input.dataset.key;

  if (input.value.length < 3) {
    input.style.setProperty('color', 'red');
    return;
  }

  view.renderAlert(key, input.value);
  view.addHandlerCloseAlert(handleCloseAlert, key, input.value);
  model
    .getRecipesBySubEntry(key, input.value)
    .then(() => {
      view.renderRecipeList(model.state.matchedRecipes);
      document.querySelectorAll('.dropdown-list').forEach(input => {
        input.style.setProperty('grid-template-columns', '1fr');
      });
      Object.entries(model.state.matchedSubSearch).forEach(entry => {
        const [key, value] = entry;
        view.renderSubSearchList(key, value);
      });
      view.addHandlerDropdownItemClick(handleDropdownItemClick);
    })
    .catch(err => console.error(err));
  document.querySelector('.logo').click();
};

/**
 * Function used to handle the click of the user on a specific element in the list of items displayed by a specific search button (Ingrédients, Appareils, Ustensiles)
 * @param {HTMLDOMElement} link value that was selected by the user
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const handleDropdownItemClick = link => {
  const key = link.dataset.key;
  const value = link.dataset[key];

  const searchInput = document.querySelector(
    `.dropdown-search[data-key="${key}"]`
  );

  const targetSubmit = searchInput
    .closest('form')
    .querySelector('.dropdown-form-submit');
  searchInput.value = value;

  targetSubmit.click();
};

/**
 * Function used to initialize the whole application
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const init = async () => {
  await model.getAllRecipes();
  view.addHandlerSubmitSearchForm(handleSubmitSearchForm);
  view.addHandlerSearchFormTextInput(handleSearchFormTextInput);
  view.addHandlerDropdownClick(handleDropdownClick);
  view.addHandlerOutsideDropdownClick(handleOutsideDropdownClick);
  view.addHandlerDropdownSearch(handleDropdownSearch);
  view.addHandlerSubmitDropdownForm(handleSubmitDropdownForm);
};

// Initialisation
init().catch(err => {
  console.error(err);
});
