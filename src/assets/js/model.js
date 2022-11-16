import { AJAX_GET } from './helpers/helpers.js';
import { dirname } from './helpers/config.js';

export const state = {
  mainSearch: false,
  matchedMainRecipes: [],
  matchedSubSearch: {
    ingredient: [],
    appliance: [],
    ustensil: [],
  },
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
};

const getRecipesList = () => {
  return JSON.parse(localStorage.getItem('recipes')).recipes;
};

const getRecipesWithNativeLoops = async entry => {
  const matchedMainRecipes = [];
  // Iterate over the recipes
  const entryUpper = entry.toUpperCase();
  for (const recipe of getRecipesList()) {
    // Add the recipe if the name or the description contains the string passed as parameter
    if (
      recipe.name.toUpperCase().includes(entryUpper) ||
      recipe.description.toUpperCase().includes(entryUpper)
    ) {
      matchedMainRecipes.push(recipe);
      continue;
    }
    // Iterate over the ingredients and add the recipe if one of them contains the string passed as parameter
    for (const ingredient of recipe.ingredients) {
      if (ingredient.ingredient.toUpperCase().includes(entryUpper)) {
        matchedMainRecipes.push(recipe);
        break;
      }
    }
  }
  return matchedMainRecipes;
};

const getAllIngredients = async recipes => {
  const matchedIngredients = [];
  for (const recipe of recipes)
    for (const ingredient of recipe.ingredients) {
      if (
        !matchedIngredients.some(
          entry => entry.toUpperCase() === ingredient.ingredient.toUpperCase()
        )
      )
        matchedIngredients.push(ingredient.ingredient);
    }
  return matchedIngredients;
};

const getAllAppliances = async recipes => {
  const matchedAppliances = [];
  for (const recipe of recipes) matchedAppliances.push(recipe.appliance);

  return matchedAppliances;
};

const getAllUstensils = async recipes => {
  const matchedUstensils = [];
  for (const recipe of recipes)
    for (const ustensil of recipe.ustensils) {
      if (
        !matchedUstensils.some(
          entry => entry.toUpperCase() === ustensil.toUpperCase()
        )
      )
        matchedUstensils.push(ustensil);
    }
  return matchedUstensils;
};

const setMainSearch = value => {
  state.mainSearch = value;
};

const setSearchProperties = async (recipes, mainSearchValue = true) => {
  const matchedSubSearch = state.matchedSubSearch;
  setMainSearch(mainSearchValue);
  [
    matchedSubSearch.ingredient,
    matchedSubSearch.appliance,
    matchedSubSearch.ustensil,
  ] = await Promise.all([
    getAllIngredients(recipes),
    getAllAppliances(recipes),
    getAllUstensils(recipes),
  ]);
};

const filterMainRecipeList = async () => {
  state.matchedRecipes = state.matchedMainRecipes;
  if (state.currentSearchedIngredients.length !== 0)
    state.matchedRecipes = await getAllRecipesByIngredients(
      state.currentSearchedIngredients
    );
  if (state.currentSearchedAppliances.length !== 0)
    state.matchedRecipes = await getAllRecipesByAppliances(
      state.currentSearchedAppliances
    );
  if (state.currentSearchedUstensils.length !== 0)
    state.matchedRecipes = await getAllRecipesByUstensils(
      state.currentSearchedUstensils
    );
};

export const getRecipesByMainEntry = async entry => {
  const recipes = await getRecipesWithNativeLoops(entry);

  state.matchedMainRecipes = recipes;
  await filterMainRecipeList();
  await setSearchProperties(state.matchedRecipes);
};

const getRecipesSubList = () => {
  return state.matchedMainRecipes.length !== 0
    ? state.matchedMainRecipes
    : getRecipesList();
};

const getAllRecipesByType = async (recipes, type, compFunc, entries) => {
  const matchedItemsRecipes = [];
  for (const recipe of recipes) {
    let comps = new Array(entries.length).fill(false);
    const iterType = !Array.isArray(recipe[type])
      ? [recipe[type]]
      : recipe[type];
    for (const item of iterType) {
      let i = 0;
      for (const entry of entries) {
        if (!comps[i])
          comps[i] = compFunc(item, entry, matchedItemsRecipes, recipe);
        i++;
      }
    }
    if (comps.reduce((acc, curr) => acc * curr, true))
      matchedItemsRecipes.push(recipe);
  }
  return matchedItemsRecipes;
};

const getAllRecipesByIngredients = async entries => {
  return getAllRecipesByType(
    getRecipesSubList(),
    'ingredients',
    (ingredient, entry) =>
      ingredient.ingredient.toUpperCase().includes(entry.toUpperCase()),
    entries
  );
};

const getAllRecipesByAppliances = async entries => {
  return getAllRecipesByType(
    getRecipesSubList(),
    'appliance',
    (appliance, entry) => appliance.toUpperCase().includes(entry.toUpperCase()),
    entries
  );
};

const getAllRecipesByUstensils = async entries => {
  return getAllRecipesByType(
    getRecipesSubList(),
    'ustensils',
    (ustensil, entry) => ustensil.toUpperCase().includes(entry.toUpperCase()),
    entries
  );
};

export const getRecipesBySubEntry = async (key, entry) => {
  switch (key) {
    case 'ingredient':
      state.currentSearchedIngredients.push(entry);
      state.matchedRecipes = await getAllRecipesByIngredients(
        state.currentSearchedIngredients
      );
      break;
    case 'appliance':
      state.currentSearchedAppliances.push(entry);
      state.matchedRecipes = await getAllRecipesByAppliances(
        state.currentSearchedAppliances
      );
      break;
    case 'ustensil':
      state.currentSearchedUstensils.push(entry);
      state.matchedRecipes = await getAllRecipesByUstensils(
        state.currentSearchedUstensils
      );
      break;
  }

  await setSearchProperties(state.matchedRecipes, false);
};

export const removeTag = async (key, entry) => {
  let arr;
  switch (key) {
    case 'ingredient':
      arr = state.currentSearchedIngredients;
      break;
    case 'appliance':
      arr = state.currentSearchedAppliances;
      break;
    case 'ustensil':
      arr = state.currentSearchedUstensils;
      break;
  }
  const index = arr.indexOf(entry);
  if (index > -1) {
    arr.splice(index, 1);
  }

  await filterMainRecipeList();
  await setSearchProperties(state.matchedRecipes, false);
};
