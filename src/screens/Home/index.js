import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, StatusBar, Platform, View, Button, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { AnimatedFlatList } from '../../components';

// firebase
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

const HomeScreen = ({ navigation }) => {
    const recipes = useSelector(state => state.recipes);

    const onSignOut = () => {
        signOut(authentication);
        navigation.replace('Login');
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
            <AnimatedFlatList
                recipes={recipes}
                origin={'Home'}
            />
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