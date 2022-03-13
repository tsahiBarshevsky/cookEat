import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppContext } from '../../utils/context';
import { primary, secondary } from '../../utils/palette';

const RecipeCard = ({ item, origin }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { open } = React.useContext(AppContext);

    // Open bottom sheet
    const onOpenOptions = () => {
        open();
        dispatch({ type: 'SET_PICKED_RECIPE', pickedRecipe: item });
    }

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Recipe', { item, origin })}
        >
            <View style={styles.container}>
                <View>
                    <SharedElement id={`${item.id}.image.${origin}`}>
                        <Image source={{ uri: item.image.url }} style={styles.image} />
                    </SharedElement>
                </View>
                <View style={styles.details}>
                    <View style={styles.category}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => onOpenOptions()}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-start' }}>
                    <Text adjustsFontSizeToFit style={styles.title}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default RecipeCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: primary,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
        elevation: 3,
        marginBottom: 10,
        borderRadius: 15,
        opacity: 0.99
    },
    image: {
        width: '100%',
        height: 130,
        resizeMode: 'cover',
        borderRadius: 10
    },
    title: {
        fontSize: 20,
        color: 'white',
        flexShrink: 1,
        marginBottom: 2
    },
    text: {
        fontSize: 18,
        color: 'white'
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 7
    },
    category: {
        backgroundColor: secondary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        elevation: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 0.5
    },
    categoryText: {
        fontSize: 17,
        color: 'white'
    }
});