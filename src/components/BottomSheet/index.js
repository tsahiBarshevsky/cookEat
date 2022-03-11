import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid, Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import Toast from 'react-native-toast-message';
import { removeRecipe } from '../../redux/actions/recipes';
import { resetPickecRecipe } from '../../redux/actions/pickedRecipe';
import { primary, hover } from '../../utils/palette';

// firebase
import { doc, deleteDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const DURATION = 150;
const { width } = Dimensions.get('window');

const BottomSheet = ({ bottomSheetRef }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pressedEdit, setPressedEdit] = useState(false);
    const [pressedDelete, setPressedDelete] = useState(false);
    const [pressedDeleteModal, setPressedDeleteModal] = useState(false);
    const [pressedCancel, setPressedCancel] = useState(false);
    const navigation = useNavigation();
    const recipes = useSelector(state => state.recipes);
    const pickedRecipe = useSelector(state => state.pickedRecipe);
    const dispatch = useDispatch();

    const onEditRecipe = () => {
        bottomSheetRef.current?.close();
        setTimeout(() => {
            navigation.navigate('Editing', { item: pickedRecipe });
        }, DURATION + 10);
    }

    const onOpenModal = () => {
        bottomSheetRef.current?.close();
        setTimeout(() => {
            setIsModalVisible(true);
        }, DURATION + 50);
    }

    const onRemoveRecipe = async () => {
        const name = pickedRecipe.name;
        const index = recipes.findIndex(recipe => recipe.id === pickedRecipe.id);
        try {
            await deleteDoc(doc(db, "recipes", pickedRecipe.id));
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            bottomSheetRef.current?.close();
            setIsModalVisible(false);
            dispatch(removeRecipe(index)); // Update store
            dispatch(resetPickecRecipe()); // Reset picked recipe to initial state
            // Check if ther's an image at cloudinary, if so - delete it
            if (pickedRecipe.image.public_id)
                fetch(`https://cloudinary-management.herokuapp.com/delete-image?public_id=${pickedRecipe.image.public_id}`)
                    .then((res) => res.json())
                    .then((res) => console.log(res))
                    .catch((error) => console.log("error: ", error.message));
            setTimeout(() => {
                Toast.show({
                    type: 'snackbar',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        type: 'success',
                        text1: 'המחיקה בוצעה',
                        text2: 'המתכון נמחק בהצלחה'
                    }
                });
            }, DURATION);
        }
    }

    return (
        <>
            <Modalize
                ref={bottomSheetRef}
                threshold={50}
                adjustToContentHeight
                handlePosition='inside'
                modalStyle={styles.modalStyle}
                handleStyle={styles.handleStyle}
                openAnimationConfig={{ timing: { duration: 500 } }}
                closeAnimationConfig={{ timing: { duration: 500 } }}
            >
                <View style={styles.bottomSheetContainer}>
                    <Text style={styles.name}>{pickedRecipe.name}</Text>
                    <View style={{ paddingHorizontal: 15 }}>
                        <View style={styles.seperator} />
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => onEditRecipe()}
                            onPressIn={() => setPressedEdit(true)}
                            onPressOut={() => setPressedEdit(false)}
                            style={[styles.BSButton, pressedEdit && styles.buttonHover]}
                            activeOpacity={1}
                        >
                            <View style={styles.icon}>
                                <FontAwesome style={{ transform: [{ translateY: 1 }] }} name="edit" size={18} color="white" />
                            </View>
                            <Text style={styles.text}>עריכה</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => onOpenModal()}
                            onPressIn={() => setPressedDelete(true)}
                            onPressOut={() => setPressedDelete(false)}
                            style={[styles.BSButton, pressedDelete && styles.buttonHover]}
                            activeOpacity={1}
                        >
                            <View style={styles.icon}>
                                <MaterialCommunityIcons name="delete-empty" size={20} color="white" />
                            </View>
                            <Text style={styles.text}>מחיקה</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modalize>
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
                animationIn={"fadeIn"}
                animationOut={"fadeOut"}
                animationInTiming={500}
                animationOutTiming={250}
                useNativeDriver
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>למחוק את {pickedRecipe.name}?</Text>
                    <Text style={styles.modalContent}>פעולה זו תמחק את המתכון לצמיתות ולא תוכל לשחזר אותו.</Text>
                    <View style={styles.modalSeparator} />
                    <TouchableOpacity
                        onPress={() => onRemoveRecipe()}
                        onPressIn={() => setPressedDeleteModal(true)}
                        onPressOut={() => setPressedDeleteModal(false)}
                        style={[styles.modalButton, pressedDeleteModal && styles.buttonHover]}
                        activeOpacity={1}
                    >
                        <Text style={[styles.modalButtonText, { color: 'red' }]}>מחק</Text>
                    </TouchableOpacity>
                    <View style={styles.modalSeparator} />
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(false)}
                        onPressIn={() => setPressedCancel(true)}
                        onPressOut={() => setPressedCancel(false)}
                        style={[styles.modalButton, pressedCancel && styles.buttonHover]}
                        activeOpacity={1}
                    >
                        <Text style={styles.modalButtonText}>אל תמחק</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    )
}

export default BottomSheet;

const styles = StyleSheet.create({
    text: {
        color: 'white'
    },
    bottomSheetContainer: {
        height: '100%',
        paddingTop: 25,
        paddingBottom: 5
    },
    modalStyle: {
        backgroundColor: primary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    handleStyle: {
        backgroundColor: 'white',
        marginTop: 2
    },
    name: {
        fontSize: 18,
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
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        marginRight: 10
    },
    BSButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 35,
        paddingHorizontal: 15,
        marginBottom: 5
    },
    buttonHover: {
        backgroundColor: hover
    },
    modalContainer: {
        width: width * 0.7,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: primary,
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        elevation: 1
    },
    modalTitle: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
    },
    modalContent: {
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
        fontSize: 18,
        color: 'white'
    }
});