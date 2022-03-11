import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useSelector, useDispatch } from 'react-redux';
import { removeRecipe } from '../../redux/actions/recipes';
import { resetPickecRecipe } from '../../redux/actions/pickedRecipe';
import { primary } from '../../utils/palette';

// firebase
import { doc, deleteDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const DURATION = 150;

const BottomSheet = ({ bottomSheetRef }) => {
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
            dispatch(removeRecipe(index)); // Update store
            dispatch(resetPickecRecipe()); // Reset picked recipe to initial state
            // Check if ther's an image at cloudinary, if so - delete it
            if (pickedRecipe.image.public_id)
                fetch(`https://cloudinary-management.herokuapp.com/delete-image?public_id=${pickedRecipe.image.public_id}`)
                    .then((res) => res.json())
                    .then((res) => console.log(res))
                    .catch((error) => console.log("error: ", error.message));
            setTimeout(() => {
                ToastAndroid.show(`${name} נמחק בהצלחה`, ToastAndroid.LONG);
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
                    <Text>{pickedRecipe.name}</Text>
                    <TouchableOpacity onPress={() => onEditRecipe()}>
                        <Text>עריכה</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onRemoveRecipe()}>
                        <Text>מחיקה</Text>
                    </TouchableOpacity>
                </View>
            </Modalize>
        </>
    )
}

export default BottomSheet;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: 220,
        paddingTop: 25
    },
    modalStyle: {
        backgroundColor: primary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    handleStyle: {
        backgroundColor: 'white',
        marginTop: 2
    }
});