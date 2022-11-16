import * as model from './model.js';
import * as view from './view.js';

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

const handleSearchFormTextInput = input => {
  const entry = input.value;
  if (entry.length < 3) return;
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

const handleDropdownClick = input => {
  const btnGroup = input.closest('.btn-group');

  btnGroup
    .querySelector('.dropdown-menu')
    .style.setProperty('transform', 'translate3d(0px, 0px, 0px)');
  btnGroup.style.setProperty(
    'max-width',
    `${model.state.mainSearch ? '667' : '275'}px`
  );
  setTimeout(() => {
    btnGroup.classList.toggle('active');
  }, 50);
};

const handleOutsideDropdownClick = input => {
  const btnGroup = input.closest('.btn-group.active');
  const active = document.querySelector('.btn-group.active');
  if (!btnGroup && active) {
    active.style.removeProperty('max-width');
    active.classList.remove('active');
    active.querySelector('.dropdown-search').value = '';
  }
};

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

const handleCloseAlert = input => {
  const alert = input.closest('.alert');
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

const handleDropdownItemClick = input => {
  const key = input.dataset.key;
  const value = input.dataset[key];

  const searchInput = document.querySelector(
    `.dropdown-search[data-key="${key}"]`
  );

  const targetSubmit = searchInput
    .closest('form')
    .querySelector('.dropdown-form-submit');
  searchInput.value = value;

  targetSubmit.click();
};

const init = async () => {
  await model.getAllRecipes();
  view.addHandlerSubmitSearchForm(handleSubmitSearchForm);
  view.addHandlerSearchFormTextInput(handleSearchFormTextInput);
  view.addHandlerDropdownClick(handleDropdownClick);
  view.addHandlerOutsideDropdownClick(handleOutsideDropdownClick);
  view.addHandlerDropdownSearch(handleDropdownSearch);
  view.addHandlerSubmitDropdownForm(handleSubmitDropdownForm);
};

init();
