import { AJAX_GET } from './helpers/helpers.js';
import { dirname } from './helpers/config.js';

export const state = {
  currentTyped: {
    value: null,
    field: 'general',
  },
  recipes: [],
};

export const getAllRecipes = async () => {
  const data = await AJAX_GET(dirname + 'data/recipes.json');

  state.recipes = data.recipes;
};

const getRecipesWithNativeLoops = async entry => {
  const matchedRecipes = [];
  // Iterate over the recipes
  for (const recipe of state.recipes) {
    // Add the recipe if the name or the description contains the string passed as parameter
    if (recipe.name.includes(entry) || recipe.description.includes(entry)) {
      matchedRecipes.push(recipe);
      continue;
    }
    // Iterate over the ingredients and add the recipe if one of them contains the string passed as parameter
    for (const ingredient of recipe.ingredients) {
      if (ingredient.ingredient.includes(entry)) {
        matchedRecipes.push(recipe);
        break;
      }
    }
  }
  return matchedRecipes;
};

export const getRecipesByEntry = entry => {
  console.time('timeTest');
  getRecipesWithNativeLoops(entry).then(arr => {
    state.matchedRecipes = arr;
    console.log(state.matchedRecipes);
  });
  console.timeEnd('timeTest');
};
