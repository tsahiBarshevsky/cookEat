import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, StatusBar, Platform, View, Button } from 'react-native';

// firebase
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore/lite';
import { authentication, db } from '../../utils/firebase';

const HomeScreen = ({ navigation }) => {
    const onSignOut = () => {
        signOut(authentication);
        navigation.replace('Login');
    }

    const getData = async () => {
        const recipesCol = collection(db, 'recipes');
        const recipeSnapshot = await getDocs(recipesCol);
        const recipesList = recipeSnapshot.docs.map(doc => doc.data());
        console.log(recipesList);
    }

    const handleBackButtonClick = () => {
        const routes = navigation.getState()?.routes;
        const prevRoute = routes[routes.length - 2];
        if (navigation.isFocused())
            BackHandler.exitApp();
        else
            // Check if it's possible to go back
            if (navigation.canGoBack()) {
                if (prevRoute.name === 'Login')
                    BackHandler.exitApp();
                else
                    navigation.goBack();
            }
            else
                BackHandler.exitApp();
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Button title='התנתק' onPress={() => onSignOut()} />
            <Button title='הוסף' onPress={() => navigation.navigate('Insertion')} />
            <Button title='הדפס' onPress={() => getData()} />
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
});