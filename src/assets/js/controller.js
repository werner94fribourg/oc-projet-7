import * as model from './model.js';
import * as view from './view.js';

const handleSubmitSearchForm = input => {
  const entry = input.value;
  if (entry.length < 3) {
    input.parentElement.querySelector('.invalid-feedback').innerText =
      'Veuillez entrer au moins 3 caractères !';
    input.classList.toggle('is-invalid');
    return;
  }
  model
    .getRecipesByMainEntry(entry)
    .then(arr => {
      view.renderRecipeList(arr);
    })
    .catch(err => console.error(err));
  input.value = '';
};

const handleSearchFormTextInput = input => {
  if (!input.classList.contains('is-invalid')) return;
  if (input.value.length >= 3) {
    input.parentElement.querySelector('.invalid-feedback').innerText = '';
    input.classList.toggle('is-invalid');
  }
};

const init = async () => {
  await model.getAllRecipes();
  view.addHandlerSubmitSearchForm(handleSubmitSearchForm);
  view.addHandlerSearchFormTextInput(handleSearchFormTextInput);
};

init();
