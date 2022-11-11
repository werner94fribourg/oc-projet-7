import { AJAX_GET } from './helpers/helpers.js';
import { dirname } from './helpers/config.js';

export const state = {
  currentTyped: {
    value: null,
    field: 'general',
  },
  matchedMainRecipes: [],
  ingredients: [],
  appliances: [],
  ustensils: [],
  currentSearchedIngredients: [],
  currentSearchedAppliances: [],
  currentSearchedUstensils: [],
  matchedRecipes: [],
};

export const getAllRecipes = async () => {
  let data = localStorage.getItem('recipes');
  if (!data) {
    data = await AJAX_GET(dirname + 'data/recipes.json');
    localStorage.setItem('recipes', JSON.stringify(data));
  }
  state.recipes = data.recipes;
};

const getRecipesList = () => {
  return JSON.parse(localStorage.getItem('recipes')).recipes;
};

const getRecipesWithNativeLoops = async entry => {
  const matchedMainRecipes = [];
  // Iterate over the recipes
  for (const recipe of getRecipesList()) {
    // Add the recipe if the name or the description contains the string passed as parameter
    if (recipe.name.includes(entry) || recipe.description.includes(entry)) {
      matchedMainRecipes.push(recipe);
      continue;
    }
    // Iterate over the ingredients and add the recipe if one of them contains the string passed as parameter
    for (const ingredient of recipe.ingredients) {
      if (ingredient.ingredient.includes(entry)) {
        matchedMainRecipes.push(recipe);
        break;
      }
    }
  }
  return matchedMainRecipes;
};

const getAllIngredients = async recipes => {
  console.log(recipes);
  return recipes.flatMap(recipe =>
    recipe.ingredients.map(ingredient => ingredient.ingredient)
  );
};

const getAllAppliances = async recipes => {
  return recipes.map(recipe => recipe.appliance);
};

const getAllUstensils = async recipes => {
  return recipes.flatMap(recipe => recipe.ustensils);
};

export const getRecipesByMainEntry = async entry => {
  const arr = await getRecipesWithNativeLoops(entry);
  state.matchedMainRecipes = arr;
  console.log(arr);
  [state.ingredients, state.appliances, state.ustensils] = await Promise.all([
    getAllIngredients(arr),
    getAllAppliances(arr),
    getAllUstensils(arr),
  ]);
  console.log(state.ingredients);
  console.log(state.appliances);
  console.log(state.ustensils);
  return arr;
};
