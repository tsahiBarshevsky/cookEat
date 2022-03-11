import { combineReducers } from "redux";
import recipesReducer from './recipes';
import pickedRecipe from './pickedRecipe';
import searchTermsReducer from "./searchTerms";

const rootReducer = combineReducers({
    recipes: recipesReducer,
    pickedRecipe: pickedRecipe,
    searchTerms: searchTermsReducer
});

export default rootReducer;