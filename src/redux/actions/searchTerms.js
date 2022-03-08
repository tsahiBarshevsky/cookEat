const addNewSearchTerm = (searchTerm) => {
    return {
        type: 'ADD_NEW_SEARCH_TERM',
        payload: searchTerm
    }
};

export { addNewSearchTerm };