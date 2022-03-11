const INITIAL_STATE = {};

const pickedRecipe = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_PICKED_RECIPE':
            return action.pickedRecipe;
        case 'RESET_PICKED_RECIPE':
            return INITIAL_STATE;
        default:
            return state;
    }
}

export default pickedRecipe;