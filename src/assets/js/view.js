export const addHandlerSubmitSearchForm = handler => {
  document.querySelector('.search-form').addEventListener('submit', event => {
    event.preventDefault();
    handler(event.target.querySelector('.form-control'));
  });
};

export const addHandlerSearchFormTextInput = handler => {
  document
    .querySelector('.search-form-input')
    .addEventListener('input', event => {
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
