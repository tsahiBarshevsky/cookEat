import update from 'immutability-helper';

const INITIAL_STATE = [];

const recipesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_RECIPES':
            return action.recipes;
        case 'ADD_NEW_RECIPE':
            return update(state, { $push: [action.payload] });
        case 'EDIT_RECIPE':
            const recipe = action.payload.recipe;
            return update(state, {
                [action.payload.index]: {
                    $merge: {
                        name: recipe.name,
                        quantity: recipe.quantity,
                        category: recipe.category,
                        youtube: recipe.youtube,
                        time: recipe.time,
                        ingredients: recipe.ingredients,
                        directions: recipe.directions
                    }
                }
            });
        case 'REMOVE_RECIPE':
            return update(state, { $splice: [[action.payload, 1]] });
        case 'UPDATE_FAVORITE':
            const index = action.payload.index;
            const favorite = action.payload.favorite;
            return update(state, { [index]: { $merge: { favorite: favorite } } });
        default:
            return state;
    }
}

export default recipesReducer;