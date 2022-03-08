import AsyncStorage from '@react-native-async-storage/async-storage';

const getRecentSearchTerms = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('searchTerms');
        return jsonValue !== null ? JSON.parse(jsonValue) : [];
    }
    catch (error) {
        alert("An unknown error occurred.");
        console.log(e.message);
    }
}

const setRecentSearchTerms = async (array) => {
    try {
        await AsyncStorage.setItem('searchTerms', array);
    }
    catch (e) {
        alert("An unknown error occurred.");
        console.log(error.message);
    }
}

export { getRecentSearchTerms, setRecentSearchTerms };