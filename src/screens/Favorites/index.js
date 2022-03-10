import React from 'react';
import { StyleSheet, Platform, StatusBar, View, SafeAreaView, Image, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { AnimatedFlatList, ScreenHeader } from '../../components';
import { background } from '../../utils/palette';

const FavoritesScreen = () => {
    const recipes = useSelector(state => state.recipes);
    const favorites = recipes.filter((recipe) => recipe.favorite);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 15 }}>
                <ScreenHeader text={'מתכונים מועדפים'} />
            </View>
            {favorites.length > 0 ?
                <AnimatedFlatList
                    recipes={favorites}
                    origin={'Favorites'}
                />
                :
                <View style={styles.messageContainer}>
                    <Image
                        source={require('../../../assets/images/favorite.png')}
                        resizeMode='cover'
                        style={styles.image}
                    />
                    <Text style={[styles.text, styles.message]}>עוד לא הוספת מתכונים מועדפים</Text>
                </View>
            }
        </SafeAreaView>
    )
}

export default FavoritesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: background
    },
    text: {
        color: 'white'
    },
    messageContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    message: {
        textAlign: 'center'
    },
    image: {
        height: 100,
        width: 100,
        marginBottom: 10
    }
});