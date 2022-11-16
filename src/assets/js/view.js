const alertColors = {
  ingredient: 'primary',
  appliance: 'success',
  ustensil: 'danger',
};

export const addHandlerSubmitSearchForm = handler => {
  document.querySelector('.search-form').addEventListener('submit', event => {
    event.preventDefault();
    handler(event.target.querySelector('.form-control'));
  });
};

export const addHandlerMainFieldSearch = handler => {
  document.querySelector('.form-control').addEventListener('keyup', event => {
    handler(event.target);
  });
};

export const addHandlerSearchFormTextInput = handler => {
  document
    .querySelector('.search-form-input')
    .addEventListener('input', event => {
      handler(event.target);
    });
};

export const addHandlerDropdownClick = handler => {
  document.querySelectorAll('.dropdown-toggle').forEach(input => {
    input.addEventListener('click', event => {
      event.preventDefault();
      handler(event.target);
    });
  });
};

export const addHandlerOutsideDropdownClick = handler => {
  window.addEventListener('click', event => {
    handler(event.target);
  });
};

export const addHandlerSubmitDropdownForm = handler => {
  document.querySelectorAll('.dropdown-form').forEach(input => {
    input.addEventListener('submit', event => {
      event.preventDefault();
      handler(event.target.querySelector('.dropdown-search'));
    });
  });
};

export const addHandlerDropdownSearch = handler => {
  document.querySelectorAll('.dropdown-search').forEach(input => {
    input.addEventListener('keyup', event => {
      handler(event.target);
    });
  });
};

export const addHandlerDropdownItemClick = handler => {
  document.querySelectorAll('.dropdown-item').forEach(input => {
    input.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      handler(event.target);
    });
  });
};

export const addHandlerCloseAlert = (handler, type, value) => {
  document
    .querySelector(`.alert[data-${type}="${value}"] .btn-close`)
    .addEventListener('click', event => {
      handler(event.target);
    });
};

export const renderRecipeList = data => {
  const markup = data
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
