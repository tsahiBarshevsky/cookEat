import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ToastAndroid, Dimensions } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from 'react-redux';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { removeRecipe } from '../../redux/actions/recipes';
import { background, primary, secondary } from '../../utils/palette';

import { AppContext } from '../../utils/context';

// firebase
import { doc, deleteDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const DURATION = 150;
const { width } = Dimensions.get('window');

const RecipeCard = ({ item, origin }) => {
    const [pressInEdit, setPressInEdit] = useState(false);
    const [pressInDelete, setPressInDelete] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    // const bottomSheetRef = useRef(null);
    const dispatch = useDispatch();
    const recipes = useSelector(state => state.recipes);

    const { bottomSheetRef, open } = React.useContext(AppContext);

    const onOpenOptions = () => {
        open();
        dispatch({ type: 'SET_PICKED_RECIPE', pickedRecipe: item });
    }

    const onEditRecipe = () => {
        bottomSheetRef.current?.close();
        setTimeout(() => {
            navigation.navigate('Editing', { item });
        }, DURATION + 10);
    }

    const onRemoveRecipe = async () => {
        const name = item.name;
        const index = recipes.findIndex(recipe => recipe.id === item.id);
        try {
            await deleteDoc(doc(db, "recipes", item.id));
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            dispatch(removeRecipe(index)); // Update store
            // Delete image from cloudinary
            if (item.image.public_id)
                fetch(`https://cloudinary-management.herokuapp.com/delete-image?public_id=${item.image.public_id}`)
                    .then((res) => res.json())
                    .then((res) => console.log(res))
                    .catch((error) => console.log("error: ", error.message));
            setTimeout(() => {
                ToastAndroid.show(`${name} נמחק בהצלחה`, ToastAndroid.LONG);
            }, DURATION);
        }
    }

    const onOpenModal = () => {
        bottomSheetRef.current?.close();
        setTimeout(() => {
            setModalVisible(true);
        }, DURATION + 50);
    }

    return (
        <>
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
            {/* <RBSheet
                ref={bottomSheetRef}
                animationType='slide'
                closeOnDragDown
                openDuration={DURATION}
                closeDuration={DURATION}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        height: 185,
                        backgroundColor: background
                    },
                    draggableIcon: {
                        backgroundColor: secondary
                    },
                    wrapper: {
                        backgroundColor: 'rgba(18, 31, 37, 0.75)'
                    }
                }}
            >
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={{ paddingHorizontal: 15 }}>
                        <View style={styles.seperator} />
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => onEditRecipe()}
                            onPressIn={() => setPressInEdit(true)}
                            onPressOut={() => setPressInEdit(false)}
                            style={[styles.button, pressInEdit && styles.buttonHover]}
                            activeOpacity={1}
                        >
                            <Entypo style={styles.icon} name="edit" size={18} color="white" />
                            <Text style={styles.text}>עריכה</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => onOpenModal()}
                            onPressIn={() => setPressInDelete(true)}
                            onPressOut={() => setPressInDelete(false)}
                            style={[styles.button, pressInDelete && styles.buttonHover]}
                            activeOpacity={1}
                        >
                            <MaterialCommunityIcons style={styles.icon} name="delete-empty" size={20} color="white" />
                            <Text style={styles.text}>מחיקה</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet> */}
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                animationIn={"fadeIn"}
                animationOut={"fadeOut"}
                animationInTiming={500}
                animationOutTiming={250}
                useNativeDriver
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>למחוק את {item.name}?</Text>
                    <Text style={styles.modalContent}>פעולה זו תמחק את המתכון לצמיתות ולא תוכל לשחזר אותו.</Text>
                    <View style={styles.modalSeparator} />
                    <TouchableOpacity
                        onPress={() => onRemoveRecipe()}
                        onPressIn={() => setPressInDelete(true)}
                        onPressOut={() => setPressInDelete(false)}
                        style={[styles.modalButton, pressInDelete && styles.buttonHover]}
                        activeOpacity={1}
                    >
                        <Text style={[styles.modalButtonText, { color: 'red' }]}>מחק</Text>
                    </TouchableOpacity>
                    <View style={styles.modalSeparator} />
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        onPressIn={() => setPressInEdit(true)}
                        onPressOut={() => setPressInEdit(false)}
                        style={[styles.modalButton, pressInEdit && styles.buttonHover]}
                        activeOpacity={1}
                    >
                        <Text style={styles.modalButtonText}>אל תמחק</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    )
}

export default RecipeCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: primary,
        padding: 7,
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
        // fontFamily: 'AlefBold',
        fontSize: 20,
        color: 'white',
        flexShrink: 1,
        marginBottom: 2
    },
    text: {
        // fontFamily: 'Alef',
        fontSize: 18,
        color: 'white'
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15
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
        // fontFamily: 'Alef',
        fontSize: 17,
        color: 'white'
    },
    name: {
        // fontFamily: 'Alef',
        fontSize: 20,
        color: 'white',
        paddingHorizontal: 15,
        flexShrink: 1
    },
    seperator: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'rgba(102, 117, 125, 0.6)',
        marginVertical: 10
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginRight: 10
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 45,
        paddingHorizontal: 15
    },
    buttonHover: {
        backgroundColor: 'rgba(102, 117, 125, 0.25)'
    },
    modalContainer: {
        width: width * 0.7,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: background,
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        elevation: 1
    },
    modalTitle: {
        // fontFamily: 'AlefBold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
    },
    modalContent: {
        // fontFamily: 'Alef',
        fontSize: 17,
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalSeparator: {
        height: 1,
        borderRadius: 0.5,
        width: '100%',
        backgroundColor: 'rgba(102, 117, 125, 0.6)',
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: '100%'
    },
    modalButtonText: {
        // fontFamily: 'Alef',
        fontSize: 18,
        color: 'white'
    }
});