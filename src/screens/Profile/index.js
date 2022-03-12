import React from 'react';
import { StyleSheet, Platform, StatusBar, Text, SafeAreaView, View, Image } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { background, secondary } from '../../utils/palette';

// Firebase
import { authentication } from '../../utils/firebase';

const ProfileScreen = ({ navigation }) => {
    const recipes = useSelector(state => state.recipes);

    return (
        <SafeAreaView style={styles.container}>
            <SharedElement id='user-image-wrapper'>
                <View style={styles.wrapper}>
                    <SharedElement id='user-image'>
                        <Image
                            source={{ uri: authentication.currentUser.photoURL }}
                            resizeMode='cover'
                            style={styles.image}
                        />
                    </SharedElement>
                </View>
            </SharedElement>
            <Text style={styles.text}>{authentication.currentUser.email}</Text>
            <Text style={styles.text}>{recipes.length}</Text>
            <Text style={styles.text}>{[...new Set(recipes.map(recipe => recipe.category))].length}</Text>
            <Text style={styles.text}>
                {new Moment(authentication.currentUser.metadata.creationTime).format('DD/MM/YYYY HH:mm')}
            </Text>
        </SafeAreaView>
    )
}

ProfileScreen.sharedElements = () => {
    return [
        {
            id: 'user-image-wrapper',
            animation: 'move',
            resize: 'clip'
        },
        {
            id: 'user-image',
            animation: 'move',
            resize: 'clip'
        }
    ];
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: background
    },
    text: {
        color: 'white'
    },
    wrapper: {
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: secondary
    },
    image: {
        height: 100,
        width: 100
    }
});