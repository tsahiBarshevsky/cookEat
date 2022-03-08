import React, { useEffect } from 'react';
import { StyleSheet, Platform, StatusBar, Text, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { BallIndicator } from 'react-native-indicators';
import { getRecentSearchTerms } from '../../utils/AsyncStorageHandler';
import { background } from '../../utils/palette';

// firebase
import { collection, query, where, getDocs } from 'firebase/firestore/lite';
import { authentication, db } from '../../utils/firebase';

const SplashScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const sortByCreateDate = (a, b) => {
        if (a.created > b.created)
            return 1;
        else
            if (b.created > a.created)
                return -1;
        return 0;
    }

    const fetchData = async () => {
        const recipesRef = collection(db, "recipes");
        const q = query(recipesRef, where("owner", "==", authentication.currentUser.email));
        try {
            const querySnapshot = await getDocs(q);
            // Update store with recipes from Firestore
            dispatch({
                type: 'SET_RECIPES',
                recipes: querySnapshot.docs.map((doc) => doc.data()).sort(sortByCreateDate)
            });
            // Update store with recent search terms from AsyncStorage
            getRecentSearchTerms()
                .then((res) => {
                    dispatch({
                        type: 'SET_SEARCH_TERMS',
                        searchTerms: res
                    })
                });
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            navigation.replace('Home');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <BallIndicator size={30} count={8} color='white' />
        </SafeAreaView>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: background,
        justifyContent: 'center',
        alignItems: 'center'
    }
});