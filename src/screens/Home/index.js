import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, Text, View, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

const HomeScreen = ({ navigation }) => {
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
        <View>
            <Button title='Sign out' onPress={() => onSignOut()} />
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({});