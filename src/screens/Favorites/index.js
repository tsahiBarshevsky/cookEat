import React from 'react';
import { StyleSheet, Platform, StatusBar, View, SafeAreaView, Image, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import { AnimatedFlatList } from '../../components';
import { background } from '../../utils/palette';

const FavoritesScreen = ({ navigation }) => {
    const recipes = useSelector(state => state.recipes);
    const favorites = recipes.filter((recipe) => recipe.favorite);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                    style={styles.headerButton}
                >
                    <Entypo style={{ transform: [{ translateY: 1 }] }} name="chevron-right" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>מתכונים מועדפים</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: 60,
        paddingHorizontal: 15
    },
    headerText: {
        color: 'white',
        fontSize: 17,
        flexShrink: 1
    },
    headerButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
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