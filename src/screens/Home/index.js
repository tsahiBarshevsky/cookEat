import React, { useEffect, useState } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { ActionsBar, AnimatedFlatList, BottomSheet, Selector } from '../../components';
import { AppContext } from '../../utils/context';
import { background, secondary } from '../../utils/palette';

// React Native components
import {
    BackHandler,
    StyleSheet,
    StatusBar,
    Platform,
    SafeAreaView,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';

// firabase
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

const HomeScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const recipes = useSelector(state => state.recipes);
    const { bottomSheetRef } = React.useContext(AppContext);

    const onSignOut = () => {
        signOut(authentication);
        setTimeout(() => {
            navigation.replace('Login');
        }, 200);
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

    return recipes.length > 0 ? (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
    ) : (
        <SafeAreaView style={styles.message}>
            <ExpoStatusBar style='light' />
            <Image
                source={require('../../../assets/images/chef.png')}
                resizeMode='contain'
                style={styles.image}
            />
            <Text style={styles.title}>
                ברוכים הבאים ל-CookEat! לפני שנתחיל במלאכת הבישול, יש להתחיל להוסיף מתכונים.
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Insertion')}
                style={[styles.button, styles.add]}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>אני רוצה להוסיף!</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onSignOut()}
                style={[styles.button, styles.signOut]}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>התנתקות</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: background
    },
    message: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: background,
        paddingHorizontal: 15
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 15
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        flexShrink: 1,
        color: 'white'
    },
    button: {
        borderRadius: 15,
        height: 40,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    add: {
        backgroundColor: secondary,
        marginTop: 15,
        marginBottom: 10
    },
    signOut: {
        borderColor: secondary,
        borderWidth: 1
    }
});