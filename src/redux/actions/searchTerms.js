const addNewSearchTerm = (searchTerm) => {
    return {
        type: 'ADD_NEW_SEARCH_TERM',
        payload: searchTerm
    }
};

const removeSearchTerm = (index) => {
    return {
        type: 'REMOVE_SEARCH_TERM',
        payload: index
    }
};

export { addNewSearchTerm, removeSearchTerm };