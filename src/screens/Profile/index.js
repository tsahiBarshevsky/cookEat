import React from 'react';
import { StyleSheet, Platform, StatusBar, TouchableOpacity, SafeAreaView, View, Image } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { background, secondary } from '../../utils/palette';

// Firebase
import { authentication } from '../../utils/firebase';

const DURATION = 200;

const ProfileScreen = ({ navigation }) => {
    const recipes = useSelector(state => state.recipes);

    return (
        <SafeAreaView style={styles.container}>
            <Animatable.View
                animation='zoomIn'
                delay={250}
                style={[styles.floatingButton, styles.close]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.floatingButtonInner}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={25} color="white" />
                </TouchableOpacity>
            </Animatable.View>
            <SharedElement id='user-image-wrapper'>
                <View style={styles.wrapper}>
                </View>
            </SharedElement>
            <SharedElement id='user-image'>
                <Image
                    source={{ uri: authentication.currentUser.photoURL }}
                    resizeMode='cover'
                    style={styles.image}
                />
            </SharedElement>
            <Animatable.Text
                animation='fadeInUp'
                delay={DURATION}
                style={[styles.text, styles.email]}
            >
                {authentication.currentUser.email}
            </Animatable.Text>
            {recipes.length > 1 ?
                <View style={styles.recipesWrapper}>
                    <Animatable.Text
                        animation='fadeInUp'
                        delay={DURATION + 100}
                        style={styles.text}
                    >
                        הוספת {recipes.length} מתכונים
                    </Animatable.Text>
                    <Animatable.Text
                        animation='fadeInUp'
                        delay={DURATION + 200}
                        style={styles.text}
                    >
                        ב-{[...new Set(recipes.map(recipe => recipe.category))].length} קטגוריות שונות
                    </Animatable.Text>
                </View>
                :
                <Animatable.Text
                    animation='fadeInUp'
                    delay={DURATION + 100}
                    style={styles.text}
                >
                    הוספת מתכון אחד
                </Animatable.Text>
            }
            <Animatable.Text
                animation='fadeInUp'
                delay={DURATION + 300}
                style={styles.text}
            >
                נרשמת בתאריך {new Moment(authentication.currentUser.metadata.creationTime).format('DD/MM/YY')}
            </Animatable.Text>
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
        color: 'white',
        textAlign: 'center'
    },
    floatingButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: StatusBar.currentHeight + 5,
        //backgroundColor: fadedBackground,
        width: 35,
        height: 35,
        borderRadius: 13,
    },
    floatingButtonInner: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 13
    },
    close: {
        right: 5
    },
    wrapper: {
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: secondary,
        marginBottom: 10
    },
    image: {
        height: 100,
        width: 100,
        position: 'absolute',
        alignSelf: 'center',
        transform: [{ translateY: -115 }]
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    recipesWrapper: {
        alignItems: 'center',
        marginVertical: 5
    }
});