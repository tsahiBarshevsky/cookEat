import React, { useState, useRef } from 'react';
import { SharedElement } from 'react-navigation-shared-element';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import SwitchSelector from 'react-native-switch-selector';
import { updateFavorite } from '../../redux/actions/recipes';
import { Ingredients, Directions, Detail } from '../../components';
import { background, fadedBackground, primary, selected, unSelected } from '../../utils/palette';

// React Native component
import {
    StyleSheet,
    StatusBar,
    Text,
    View,
    Image,
    TouchableOpacity,
    Linking,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Pressable
} from 'react-native';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const DURATION = 200;
const { width } = Dimensions.get('window');

const RecipeScreen = ({ route, navigation }) => {
    const { item, origin } = route.params;
    const recipes = useSelector(state => state.recipes);
    const [favorite, setFavorite] = useState(item.favorite);
    const dispatch = useDispatch();
    const scorllRef = useRef();

    const handleFavoriteCahnge = async (id, favorite) => {
        const recipeRef = doc(db, "recipes", id);
        try {
            // Update document on Firestore
            await updateDoc(recipeRef, { favorite: favorite });
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            setFavorite(favorite);
            const index = recipes.findIndex(recipes => recipes.id === id);
            dispatch(updateFavorite(index, favorite)); // Update store
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent backgroundColor={'transparent'} />
            <View style={{ height: '40%' }}>
                <SharedElement id={`${item.id}.image.${origin}`}>
                    <Image
                        source={{ uri: item.image.url }}
                        resizeMode='cover'
                        style={{ height: '100%', width: '100%', zIndex: 1 }}
                    />
                </SharedElement>
                <Animatable.View
                    animation='zoomIn'
                    delay={250}
                    style={[styles.floatingButton, styles.close]}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={25} color="white" />
                    </TouchableOpacity>
                </Animatable.View>
                <Animatable.View
                    animation='zoomIn'
                    delay={250}
                    style={[styles.floatingButton, styles.favorite]}
                >
                    <TouchableOpacity onPress={() => handleFavoriteCahnge(item.id, !favorite)}>
                        {favorite ?
                            <FontAwesome name="bookmark" size={22} color="white" />
                            :
                            <FontAwesome name="bookmark-o" size={22} color="white" />
                        }
                    </TouchableOpacity>
                </Animatable.View>
            </View>
            <SharedElement id={`${item.id}.details.${origin}`} style={{ flex: 1 }}>
                <View style={styles.recipe}>
                    <View style={{ alignItems: 'center', padding: 15 }}>
                        <Text>{item.name}</Text>
                    </View>
                    <View style={styles.details}>
                        <Animatable.View
                            animation='bounceIn'
                            delay={DURATION}
                        >
                            <Detail
                                type={'time'}
                                value={`${item.time.value} ${item.time.unit}`}
                            />
                        </Animatable.View>
                        <View style={styles.seperator} />
                        <Animatable.View
                            animation='bounceIn'
                            delay={DURATION + 200}
                        >
                            <Detail
                                type={'quantity'}
                                value={`${item.quantity} מנות`}
                            />
                        </Animatable.View>
                        <View style={styles.seperator} />
                        <Animatable.View
                            animation='bounceIn'
                            delay={DURATION + 400}
                        >
                            <Detail
                                type={'category'}
                                value={item.category}
                            />
                        </Animatable.View>
                    </View>
                    <Animatable.View
                        animation='fadeInUp'
                        delay={DURATION}
                        style={{ height: '100%', flex: 1 }}
                    >
                        <SwitchSelector
                            options={options}
                            initial={0}
                            onPress={(value) => scorllRef.current?.scrollTo({ x: value })}
                            buttonMargin={6}
                            textColor='rgba(255, 255, 255, 0.2)'
                            buttonColor={selected}
                            backgroundColor={unSelected}
                            style={{ paddingHorizontal: 15 }}
                        />
                        <ScrollView
                            horizontal
                            ref={scorllRef}
                            decelerationRate="fast"
                            snapToInterval={width}
                            showsHorizontalScrollIndicator={false}
                            overScrollMode="never"
                            pagingEnabled
                            scrollEnabled={false}
                            style={styles.ingredientsAndDirections}
                        >
                            <View style={styles.wrapper}>
                                {/* <View style={styles.wrapperHeader}>
                                    <Text style={styles.wrapperTitle}>מרכיבים</Text>
                                    <Text style={styles.wrapperNote}>({item.ingredients.length} פריטים)</Text>
                                </View> */}
                                <Ingredients ingredients={item.ingredients} />
                            </View>
                            <View style={styles.wrapper}>
                                {/* <View style={styles.wrapperHeader}>
                                    <Text style={styles.wrapperTitle}>אופן ההכנה</Text>
                                    <Text style={styles.wrapperNote}>({item.directions.length} פריטים)</Text>
                                </View> */}
                                <Directions directions={item.directions} />
                            </View>
                        </ScrollView>
                    </Animatable.View>
                </View>
            </SharedElement>
            {/* <View style={styles.header}>
                <Animatable.View
                    animation='zoomIn'
                    delay={250}
                    style={[styles.button, styles.save]}
                >
                    <TouchableOpacity onPress={() => handleFavoriteCahnge(item.id, !favorite)}>
                        {favorite ?
                            <FontAwesome name="bookmark" size={24} color="white" />
                            :
                            <FontAwesome name="bookmark-o" size={24} color="white" />
                        }
                    </TouchableOpacity>
                </Animatable.View>
                <Animatable.View
                    animation='zoomIn'
                    delay={250}
                    style={[styles.button, styles.close]}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={26} color="white" />
                    </TouchableOpacity>
                </Animatable.View>
            </View>
            <View style={{ marginHorizontal: 15 }}>
                <SharedElement id={`${item.id}.image.${origin}`}>
                    <Image source={{ uri: item.image.url }} style={styles.image} />
                </SharedElement>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.detailsHeader}>
                    <Text style={styles.title}>{item.name}</Text>
                    {item.youtube &&
                        <TouchableOpacity style={styles.youtube} activeOpacity={0.9} onPress={() => Linking.openURL(item.youtube)}>
                            <AntDesign name="youtube" size={30} color='#c4302b' />
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.details}>
                    <Animatable.View
                        animation='bounceIn'
                        delay={DURATION}
                    >
                        <Detail
                            type={'time'}
                            value={`${item.time.value} ${item.time.unit}`}
                        />
                    </Animatable.View>
                    <View style={styles.seperator} />
                    <Animatable.View
                        animation='bounceIn'
                        delay={DURATION + 100}
                    >
                        <Detail
                            type={'quantity'}
                            value={`${item.quantity} מנות`}
                        />
                    </Animatable.View>
                    <View style={styles.seperator} />
                    <Animatable.View
                        animation='bounceIn'
                        delay={DURATION + 200}
                    >
                        <Detail
                            type={'category'}
                            value={item.category}
                        />
                    </Animatable.View>
                </View>
                <Animatable.View
                    animation='fadeInUp'
                    delay={DURATION}
                    style={{ height: '100%', flex: 1 }}
                >
                    <ScrollView
                        horizontal
                        decelerationRate="fast"
                        snapToInterval={width}
                        showsHorizontalScrollIndicator={false}
                        style={styles.ingredientsAndDirections}
                        overScrollMode="never"
                    >
                        <View style={styles.wrapper}>
                            <View style={styles.wrapperHeader}>
                                <Text style={styles.wrapperTitle}>מרכיבים</Text>
                                <Text style={styles.wrapperNote}>({item.ingredients.length} פריטים)</Text>
                            </View>
                            <Ingredients ingredients={item.ingredients} />
                        </View>
                        <View style={styles.wrapper}>
                            <View style={styles.wrapperHeader}>
                                <Text style={styles.wrapperTitle}>אופן ההכנה</Text>
                                <Text style={styles.wrapperNote}>({item.directions.length} פריטים)</Text>
                            </View>
                            <Directions directions={item.directions} />
                        </View>
                    </ScrollView>
                </Animatable.View>
            </View> */}
        </SafeAreaView>
    )
}

RecipeScreen.sharedElements = (route) => {
    const { item, origin } = route.params;
    return [
        {
            id: `${item.id}.image.${origin}`,
            animation: 'move',
            resize: 'clip'
        },
        {
            id: `${item.id}.details.${origin}`,
            animation: 'fade',
            resize: 'clip'
        }
    ];
}

const options = [
    { label: "מרכיבים", value: width },
    { label: "אופן ההכנה", value: 0 }
];

export default RecipeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: background,
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    recipe: {
        flex: 1,
        marginTop: -30,
        backgroundColor: background,
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35
    },
    floatingButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: StatusBar.currentHeight + 5,
        backgroundColor: fadedBackground,
        width: 35,
        height: 35,
        borderRadius: 13,
    },
    close: {
        right: 15
    },
    favorite: {
        left: 15
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 5,
        marginBottom: 10
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
        borderRadius: 15
    },
    detailsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 15
    },
    youtube: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        //fontFamily: 'AlefBold',
        fontSize: 22,
        color: 'white',
        flexShrink: 1,
        marginRight: 10
    },
    text: {
        color: 'black'
    },
    detailsContainer: {
        flex: 1,
        alignItems: 'flex-start'
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 15
    },
    ingredientsAndDirections: {
        width: width
    },
    wrapper: {
        width: width,
        paddingHorizontal: 15
    },
    wrapperHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    wrapperTitle: {
        //fontFamily: 'AlefBold',
        fontSize: 20,
        color: 'white'
    },
    wrapperNote: {
        //fontFamily: 'Alef',
        fontSize: 10,
        color: 'white'
    },
    seperator: {
        width: 1,
        height: '60%',
        borderRadius: 0.5,
        backgroundColor: primary,
        alignSelf: 'center',
        marginHorizontal: 20
    },
});