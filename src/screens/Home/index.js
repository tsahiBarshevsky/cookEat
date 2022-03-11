import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, StatusBar, Platform, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { ActionsBar, AnimatedFlatList, BottomSheet, Selector } from '../../components';
import { AppContext } from '../../utils/context';
import { background } from '../../utils/palette';

const HomeScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const recipes = useSelector(state => state.recipes);
    const { bottomSheetRef, open } = React.useContext(AppContext);

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
            <ExpoStatusBar style='light' />
            <ActionsBar size={recipes.length} />
            <Selector
                categories={[...new Set(recipes.map(recipe => recipe.category))]}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <AnimatedFlatList
                recipes={recipes.filter((recipe) => recipe.category.includes(selectedCategory))}
                origin={'Home'}
            />
            <BottomSheet bottomSheetRef={bottomSheetRef} />
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: background
    }
});