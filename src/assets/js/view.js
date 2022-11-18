/**
 * @param {Object} alertColors object used to store all alert color classes of the tags related to the type of it
 * @param {string} alertColors.ingredient alert color class related to the ingredients
 * @param {string} alertColors.appliance alert color class related to the appliances
 * @param {string} alertColors.ustensil alert color class related to the ustensils
 * @author Werner Schmid
 */
const alertColors = {
  ingredient: 'primary',
  appliance: 'success',
  ustensil: 'danger',
};

/**
 * Function used to add an event listener when the user is submitting the main search form
 * @param {Function} handler handler function that will be called when the event is triggered
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const addHandlerSubmitSearchForm = handler => {
  document.querySelector('.search-form').addEventListener('submit', event => {
    event.preventDefault();
    handler(event.target.querySelector('.form-control'));
  });
};

/**
 * Function used to add an event listener when the user is typing in the main search input
 * @param {Function} handler handler function that will be called when the event is triggered
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const addHandlerSearchFormTextInput = handler => {
  document
    .querySelector('.search-form-input')
    .addEventListener('input', event => {
      handler(event.target);
    });
};

/**
 * Function used to add an event listener when the user is clicking one of the subsearching buttons
 * @param {Function} handler handler function that will be called when the event is triggered
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const addHandlerDropdownClick = handler => {
  document.querySelectorAll('.dropdown-toggle').forEach(input => {
    input.addEventListener('click', event => {
      event.preventDefault();
      handler(event.target);
    });
  });
};

/**
 * Function used to add an event listener when the user is clicking outside the active subsearching button
 * @param {Function} handler handler function that will be called when the event is triggered
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const addHandlerOutsideDropdownClick = handler => {
  window.addEventListener('click', event => {
    handler(event.target);
  });
};

/**
 * Function used to add an event listener when the user is submitting one of the subsearching forms
 * @param {Function} handler handler function that will be called when the event is triggered
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const addHandlerSubmitDropdownForm = handler => {
  document.querySelectorAll('.dropdown-form').forEach(input => {
    input.addEventListener('submit', event => {
      event.preventDefault();
      handler(event.target.querySelector('.dropdown-search'));
    });
  });
};

/**
 * Function used to add an event listener when the user is typing in the input of one of the subsearching forms
 * @param {Function} handler handler function that will be called when the event is triggered
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const addHandlerDropdownSearch = handler => {
  document.querySelectorAll('.dropdown-search').forEach(input => {
    input.addEventListener('keyup', event => {
      handler(event.target);
    });
  });
};

/**
 * Function used to add an event listener when the user clicks one of the specific tags
 * @param {Function} handler handler function that will be called when the event is triggered
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const addHandlerDropdownItemClick = handler => {
  document.querySelectorAll('.dropdown-item').forEach(input => {
    input.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      handler(event.target);
    });
  });
};

/**
 * Function used to add an event listener when the user clicks the close button of one of the tags
 * @param {Function} handler handler function that will be called when the event is triggered
 * @param {string} type type of the tag on which we want to add the event handler
 * @param {string} value value displayed of the tag on which we want to add the event handler
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const addHandlerCloseAlert = (handler, type, value) => {
  document
    .querySelector(`.alert[data-${type}="${value}"] .btn-close`)
    .addEventListener('click', event => {
      handler(event.target);
    });
};

/**
 * Function used to render the list of recipes in the interface
 * @param {Array} data array of recipes we want to display in the interface
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const renderRecipeList = data => {
  const markup =
    data.length === 0
      ? `<p class="not-found-message">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>`
      : data
          .map(
            recipe => `
          <div class="card">
            <div class="card-img-top"></div>
            <!--<img src="/" class="card-img-top" alt="..." />-->
            <div class="card-body">
              <div class="row first-row">
                <h5 class="card-title col">${recipe.name}</h5>
                <p class="card-description col-4">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <title>clock</title>
                    <path d="M20.586 23.414l-6.586-6.586v-8.828h4v7.172l5.414 5.414zM16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 28c-6.627 0-12-5.373-12-12s5.373-12 12-12c6.627 0 12 5.373 12 12s-5.373 12-12 12z"></path>
                  </svg>
                  ${recipe.time} min
                </p>
              </div>
              <div class="row">
                <ul class="card-list col">
                  ${recipe.ingredients
                    .map(
                      ingredient => `
                      <li class="card-list-item">
                        <span class="card-list-ingredient">
                        ${ingredient.ingredient}${
                        ingredient.quantity ? ': ' : ' '
                      } 
                        </span>
                        ${
                          ingredient.quantity
                            ? `<span class="card-list-quantity">
                              ${ingredient.quantity}${
                                ingredient.unit ? ingredient.unit : ''
                              }
                            </span>`
                            : ''
                        }
                      </li>
                      `
                    )
                    .join('\n')}
                </ul>
                <p class="card-text col">
                  ${recipe.description}
                </p>
              </div>
            </div>
          </div>
  `
          )
          .join('\n');
  document.querySelector('.menu-list').innerHTML = markup;
};

/**
 * Function used to render the list of tags (ingredients, appliances, ustensils) into its respective dropdown list
 * @param {string} type type of the list of tags we want to display
 * @param {Array} data array of tags (ingredients, appliances, ustensils) we want to display in the interface
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const renderSubSearchList = (type, data) => {
  const markup = data
    .map(
      item => `
      <a class="dropdown-item" href="#" data-key="${type}" data-${type}="${item}">${item}</a>
    `
    )
    .join('\n');
  document.querySelector(`.${type}-dropdown .dropdown-list`).innerHTML = markup;
};

/**
 * Function used to display a new alert tag into the page
 * @param {string} type type of the new alert tag we want to display
 * @param {string} value value of the tag we want to display
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
export const renderAlert = (type, value) => {
  if (document.querySelector(`.alert[data-${type}="${value}"]`) !== null)
    return;
  const markup = `
  <div class="alert alert-${alertColors[type]} alert-dismissible fade show" role="alert" data-key="${type}" data-${type}="${value}">
    ${value}
    <button type="button" class="btn-close border border-white rounded-circle" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  `;
  document.querySelector('.alert-row').insertAdjacentHTML('beforeend', markup);
};
