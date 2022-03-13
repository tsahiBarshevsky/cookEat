import React from 'react';
import { StyleSheet, Platform, StatusBar, SafeAreaView, View, Image } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SharedElement } from 'react-navigation-shared-element';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import TouchableScale from 'react-native-touchable-scale';
import { background, secondary } from '../../utils/palette';

// Firebase
import { authentication } from '../../utils/firebase';

const DURATION = 200;

const ProfileScreen = ({ navigation }) => {
    const recipes = useSelector(state => state.recipes);

    return (
        <SafeAreaView style={styles.container}>
            <ExpoStatusBar style='light' backgroundColor={background} />
            <View style={styles.content}>
                <TouchableScale
                    activeScale={0.95}
                    tension={50}
                    friction={7}
                    useNativeDriver
                    onPress={() => navigation.goBack()}
                >
                    <SharedElement id='user-image-wrapper'>
                        <View style={styles.wrapper} />
                    </SharedElement>
                    <SharedElement id='user-image'>
                        <Image
                            source={{ uri: authentication.currentUser.photoURL }}
                            resizeMode='cover'
                            style={styles.image}
                        />
                    </SharedElement>
                </TouchableScale>
                <View style={{ alignItems: 'flex-start' }}>
                    <Animatable.Text
                        animation='fadeInRight'
                        delay={DURATION}
                        style={[styles.text, styles.email]}
                    >
                        {authentication.currentUser.email}
                    </Animatable.Text>
                    {recipes.length > 1 ?
                        <View style={styles.recipesWrapper}>
                            <Animatable.Text
                                animation='fadeInRight'
                                delay={DURATION + 100}
                                style={styles.text}
                            >
                                הוספת {recipes.length} מתכונים
                            </Animatable.Text>
                            <Animatable.Text
                                animation='fadeInRight'
                                delay={DURATION + 200}
                                style={styles.text}
                            >
                                ב-{[...new Set(recipes.map(recipe => recipe.category))].length} קטגוריות שונות
                            </Animatable.Text>
                        </View>
                        :
                        <Animatable.Text
                            animation='fadeInRight'
                            delay={DURATION + 100}
                            style={styles.text}
                        >
                            הוספת מתכון אחד
                        </Animatable.Text>
                    }
                    <Animatable.Text
                        animation='fadeInRight'
                        delay={DURATION + 300}
                        style={styles.text}
                    >
                        נרשמת בתאריך {new Moment(authentication.currentUser.metadata.creationTime).format('DD/MM/YY')}
                    </Animatable.Text>
                </View>
            </View>
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
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    content: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: background,
        borderBottomColor: secondary,
        borderBottomWidth: 0.5
    },
    text: {
        color: 'white',
        flexShrink: 1
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
        width: 100,
        position: 'absolute',
        alignSelf: 'center',
        transform: [{ translateY: -105 }]
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    recipesWrapper: {
        alignItems: 'flex-start',
        marginVertical: 5
    }
});