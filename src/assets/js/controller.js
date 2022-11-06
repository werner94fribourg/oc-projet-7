import { dirname } from './helpers/config.js';
import { AJAX_GET } from './helpers/helpers.js';
import { getAllRecipes, getRecipesByEntry, state } from './model.js';

getAllRecipes()
  .then(() => {
    getRecipesByEntry('coco');
  })
  .catch(err => console.error(err));
