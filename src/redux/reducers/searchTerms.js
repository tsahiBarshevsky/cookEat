import update from 'immutability-helper';

const INITIAL_STATE = [];

const searchTermsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_SEARCH_TERMS':
            return action.searchTerms;
        case 'ADD_NEW_SEARCH_TERM':
            return update(state, { $push: [action.payload] });
        case 'REMOVE_SEARCH_TERM':
            return update(state, { $splice: [[action.payload, 1]] });
        default:
            return state;
    }
}

export default searchTermsReducer;