import { combineReducers } from "redux";
import recipesReducer from './recipes';
import searchTermsReducer from "./searchTerms";

const rootReducer = combineReducers({
    recipes: recipesReducer,
    searchTerms: searchTermsReducer
});

export default rootReducer;