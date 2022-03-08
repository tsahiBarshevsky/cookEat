import React, { useEffect } from 'react';
import { StyleSheet, Platform, StatusBar, Text, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { BallIndicator } from 'react-native-indicators';
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

    const fetchRecipes = async () => {
        const recipesRef = collection(db, "recipes");
        const q = query(recipesRef, where("owner", "==", authentication.currentUser.email));
        try {
            const querySnapshot = await getDocs(q);
            dispatch({ type: 'SET_RECIPES', recipes: querySnapshot.docs.map((doc) => doc.data()).sort(sortByCreateDate) });
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            navigation.replace('Home');
        }
    }

    useEffect(() => {
        fetchRecipes();
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