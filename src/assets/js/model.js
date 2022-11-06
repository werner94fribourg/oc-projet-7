import { AJAX_GET } from './helpers/helpers.js';
import { dirname } from './helpers/config.js';

/**
 * @param {Object} state object representing the state of the application
 * @param {boolean} state.mainSearch Value informing if the used requested a search on the global search input
 * @param {Array} state.matchedMainRecipes Array storing all the recipes matching the value searched in the main search form
 * @param {Object} state.matchedSubSearch Object containing the list of all ingredients, appliances and ustensils of the matched recipes
 * @param {Array} state.currentSearchedIngredients Array of all the ingredients actually tagged by the user in his search
 * @param {Array} state.currentSearchedAppliances Array of all the appliances actually tagged by the user in his search
 * @param {Array} state.currentSearchedUstensils Array of all the ustensils actually tagged by the user in his search
 * @param {Array} state.matchedRecipes Array storing all the recipes matching the value searched in the main search form and all the existing tags
 * @author Werner Schmid
 */
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

/**
 * Async function used to retrieve all the recipes from the local storage. If they aren't stored there, it will fetch it from the recipes.json file and store it there.
 * @returns {Promise} a Promise that will succeed if all the operations works smoothly
 * @author Werner Schmid
 */
export const getAllRecipes = async () => {
  let data = localStorage.getItem('recipes');
  if (!data) {
    data = await AJAX_GET(dirname + 'data/recipes.json');
    localStorage.setItem('recipes', JSON.stringify(data));
  }
};

/**
 * Function used to retrieve all existing recipes from the local storage
 * @returns {Array} the list of all stored recipes
 * @author Werner Schmid
 */
const getRecipesList = () => {
  return JSON.parse(localStorage.getItem('recipes')).recipes;
};

/**
 * In this branch, we developed the search algorithm using array methods and asynchronity in JavaScript
 */

/**
 * Function used to remove all the duplicates of an array
 * @param {Array} arr list of recipes we want to filter
 * @returns {Array} the new sorted array with no duplicates
 * @author Werner Schmid
 */
const sortAndFilterDoubles = async arr =>
  arr
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => (a.id < b.id ? -1 : 1));

/**
 * Function used to filter the recipes by their name or description
 * @param {string} entry entry on which we want to filter the arrays by name and description
 * @returns {Array} the new filtered recipes array with the ones matching the name and the description
 */
const getRecipesWithEntryNameOrDescription = async entry => {
  return state.recipes.filter(
    recipe => recipe.name.includes(entry) || recipe.description.includes(entry)
  );
};

/**
 * Function used to filter the recipes by their ingredient's names
 * @param {string} entry entry on which we want to filter the arrays by their ingredient's names
 * @returns {Array} the new filtered recipes array with at least one ingredient matching the entry
 */
const getRecipesWithIngredientName = async entry => {
  return state.recipes.filter(recipe =>
    recipe.ingredients.some(ingredient => ingredient.ingredient.includes(entry))
  );
};

/**
 * Async function used to find the recipes matching a specific entry with an algorithm using the native loops
 * @param {string} entry the entry typed by the user
 * @returns {Promise} a Promise containing all recipes matching the entry if all the operations succeeded
 * @author Werner Schmid
 */
const getRecipesWithArrayMethods = async entry => {
  const [entryNameOrDescriptionRecipes, ingredientNameRecipes] =
    await Promise.all([
      getRecipesWithEntryNameOrDescription(entry),
      getRecipesWithIngredientName(entry),
    ]);
  const finalArray = await sortAndFilterDoubles(
    entryNameOrDescriptionRecipes.concat(ingredientNameRecipes)
  );
  return finalArray;
};

/**
 * Async function used to retrieve all existing ingredients of a specific list of recipes
 * @param {Array} recipes array of recipes on which we want to retrieve all existing ingredients
 * @returns {Promise} a Promise containing all existing ingredients of the passed recipes if all the operations succeeded
 * @author Werner Schmid
 */
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

/**
 * Async function used to retrieve all existing appliances of a specific list of recipes
 * @param {Array} recipes array of recipes on which we want to retrieve all existing appliances
 * @returns {Promise} a Promise containing all existing appliances of the passed recipes if all the operations succeeded
 * @author Werner Schmid
 */
const getAllAppliances = async recipes => {
  const matchedAppliances = [];
  for (const recipe of recipes) matchedAppliances.push(recipe.appliance);

  return matchedAppliances;
};

/**
 * Async function used to retrieve all existing ustensils of a specific list of recipes
 * @param {Array} recipes array of recipes on which we want to retrieve all existing ustensils
 * @returns {Promise} a Promise containing all existing ustensils of the passed recipes if all the operations succeeded
 * @author Werner Schmid
 */
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

/**
 * Function used to modify the value of the mainSearch parameter of the state object
 * @param {boolean} value new value of the mainSearch parameter of the state object
 * @returns {undefined} no specific value returned
 * @author Werner Schmid
 */
const setMainSearch = value => {
  state.mainSearch = value;
};

/**
 * Async function used to update the state.mainSearch value and the list of ingredients, appliances and ustensiles in the state.matchedSubSearch object. Those parameters will be used by the UI to update its displayed list of elements
 * @param {Array} recipes array of recipes we use to update the list of ingredients, appliances and ustensils in the state.matchedSubSearch object
 * @param {boolean} mainSearchValue new value of the state.mainSearch.
 * @returns {Promise} a Promise that will succeed if all the operations works smoothly
 * @author Werner Schmid
 */
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

/**
 * Async function used to filter the recipes matching the main search (state.matchedMainRecipes) so that state.matchedRecipes contains only the recipes matching all the current active tags (e.g. state.currentSearchedIngredients)
 * @returns {Promise} a Promise that will succeed if all the operations works smoothly
 * @author Werner Schmid
 */
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

/**
 * Function used to retrieve all the recipes based by the entry passed by the user and the current active tags
 * @param {string} entry the entry typed by the user
 * @returns {Promise} a Promise that will succeed if all the operations works smoothly
 * @author Werner Schmid
 */
export const getRecipesByMainEntry = async entry => {
  const recipes = await getRecipesWithArrayMethods(entry);

  state.matchedMainRecipes = recipes;
  await filterMainRecipeList();
  await setSearchProperties(state.matchedRecipes);
};

/**
 * Function used to return the list of recipes matching the current typed entry if a search was already made and all existing recipes otherwise
 * @returns {Array} a list of recipes
 * @author Werner Schmid
 */
const getRecipesSubList = () => {
  return state.matchedMainRecipes.length !== 0
    ? state.matchedMainRecipes
    : getRecipesList();
};

/**
 * Function used to filter a list of recipes based on a certain type (ingredient, appliance, ustensil) and a list of entries
 * @param {Array} recipes list of recipes on which we want to apply the filter
 * @param {string} type type of element on which we want to check if the recipe matches the condition (ingredient, appliance, ustensil)
 * @param {Function} compFunc function used to compare a recipe based on an ingredient, appliance and ustensil
 * @param {Array} entries entries on which we want to compare if an element matches a condition
 * @returns {Promise} a Promise containing the array of filtered recipes if all the operations works smoothly
 * @author Werner Schmid
 */
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

/**
 * Function used to filter a list of recipes based on its ingredients and a list of entries
 * @param {Array} entries entries on which we want to compare if an element matches a condition
 * @returns {Promise} a Promise containing the array of filtered recipes if all the operations works smoothly
 * @author Werner Schmid
 */
const getAllRecipesByIngredients = async entries => {
  return getAllRecipesByType(
    getRecipesSubList(),
    'ingredients',
    (ingredient, entry) =>
      ingredient.ingredient.toUpperCase().includes(entry.toUpperCase()),
    entries
  );
};

/**
 * Function used to filter a list of recipes based on its appliances and a list of entries
 * @param {Array} entries entries on which we want to compare if an element matches a condition
 * @returns {Promise} a Promise containing the array of filtered recipes if all the operations works smoothly
 * @author Werner Schmid
 */
const getAllRecipesByAppliances = async entries => {
  return getAllRecipesByType(
    getRecipesSubList(),
    'appliance',
    (appliance, entry) => appliance.toUpperCase().includes(entry.toUpperCase()),
    entries
  );
};

/**
 * Async function used to filter a list of recipes based on its ustensils and a list of entries
 * @param {Array} entries entries on which we want to compare if an element matches a condition
 * @returns {Promise} a Promise containing the array of filtered recipes if all the operations works smoothly
 * @author Werner Schmid
 */
const getAllRecipesByUstensils = async entries => {
  return getAllRecipesByType(
    getRecipesSubList(),
    'ustensils',
    (ustensil, entry) => ustensil.toUpperCase().includes(entry.toUpperCase()),
    entries
  );
};

/**
 * Async function used to add a new entry into the searched tags and to refilter the matched recipes
 * @param {string} key the type of the tag we want to add (ingredient, ustensil, appliance)
 * @param {string} entry the entry submitted by the user
 * @returns {Promise} a Promise that will succeed if all the operations works smoothly
 * @author Werner Schmid
 */
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

/**
 * Async function used to remove an entry fro the searched tags and to refilter the matched recipes
 * @param {string} key the type of the tag we want to remove (ingredient, ustensil, appliance)
 * @param {string} entry the entry that has to be removed
 * @returns {Promise} a Promise that will succeed if all the operations works smoothly
 * @author Werner Schmid
 */
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
