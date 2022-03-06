const addNewRecipe = (recipe) => {
    return {
        type: 'ADD_NEW_RECIPE',
        payload: recipe
    }
};

const editRecipe = (index, recipe) => {
    return {
        type: 'EDIT_RECIPE',
        payload: {
            index: index,
            recipe: recipe
        }
    }
}

const removeRecipe = (index) => {
    return {
        type: 'REMOVE_RECIPE',
        payload: index
    }
};

const updateFavorite = (index, favorite) => {
    return {
        type: 'UPDATE_FAVORITE',
        payload: {
            index: index,
            favorite: favorite
        }
    }
};

export { addNewRecipe, editRecipe, removeRecipe, updateFavorite };