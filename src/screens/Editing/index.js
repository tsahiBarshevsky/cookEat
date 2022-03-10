import React, { useState, useRef } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Text, Platform, StatusBar, TextInput, View, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';
import uuid from 'react-native-uuid';
import RadioForm from 'react-native-simple-radio-button';
import { AntDesign } from '@expo/vector-icons';
import update from 'immutability-helper';
import { useSelector } from 'react-redux';
import { editRecipe } from '../../redux/actions/recipes';
import { background, primary, secondary, placeholder } from '../../utils/palette';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';
import ScreenHeader from '../../components/Header';

const EditingScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const recipes = useSelector(state => state.recipes);
    const [name, setName] = useState(item.name);
    const [time, setTime] = useState(item.time);
    const [quantity, setQuantity] = useState(item.quantity);
    const [category, setCategory] = useState(item.category);
    const [youtube, setYoutube] = useState(item.youtube);
    const [ingredients, setIngredients] = useState(item.ingredients);
    const [directions, setDirections] = useState(item.directions);
    const dispatch = useDispatch();

    // References for next textInput
    const nameRef = useRef(null);
    const quantityRef = useRef(null);
    const categoryRef = useRef(null);
    const timeRef = useRef(null);
    const youtubeRef = useRef(null);
    const ingredientRef = useRef(null);
    const amountRef = useRef(null);
    const unitRef = useRef(null);
    const directionRef = useRef(null);

    // Ingredients handlers
    const handleAddIngredient = () => {
        const _ingredients = [...ingredients];
        _ingredients.push({ key: uuid.v4() });
        setIngredients(_ingredients);
    }

    const handleRemoveIngredient = (key) => {
        const _ingredients = ingredients.filter((input, index) => index !== key);
        setIngredients(_ingredients);
    }

    const handleIngredientTitleChange = (text, key) => {
        const _ingredients = [...ingredients];
        _ingredients[key].title = text;
        setIngredients(_ingredients);
    }

    const handleIngredientAmountChange = (text, key) => {
        const _ingredients = [...ingredients];
        _ingredients[key].amount = text;
        setIngredients(_ingredients);
    }

    const handleIngredientUnitChange = (text, key) => {
        const _ingredients = [...ingredients];
        _ingredients[key].unit = text;
        setIngredients(_ingredients);
    }

    // Directions handlers
    const handleAddDirection = (index) => {
        const _directions = [...directions];
        _directions.push({});
        setDirections(_directions);
    }

    const handleRemoveDirection = (key) => {
        const _directions = directions.filter((input, index) => index !== key);
        setDirections(_directions);
    }

    const handleDirectionChange = (text, key) => {
        const _directions = [...directions];
        _directions[key].value = text;
        _directions[key].key = key;
        setDirections(_directions);
    }

    const onEditRecipe = async () => {
        const editedRecipe = {
            name: name,
            quantity: quantity,
            category: category,
            youtube: youtube !== '' ? youtube : null,
            time: {
                value: time.value,
                unit: time.value > 1 ? (time.unit === 'דקה' ? 'דקות' : 'שעות') : (time.unit === 'דקה' ? 'דקה' : 'שעה')
            },
            ingredients: ingredients,
            directions: directions,
        };
        const recipeRef = doc(db, "recipes", item.id);
        try {
            // Update document on Firestore
            await updateDoc(recipeRef, {
                name: editedRecipe.name,
                quantity: editedRecipe.quantity,
                category: editedRecipe.category,
                youtube: editedRecipe.youtube,
                time: {
                    unit: editedRecipe.time.unit,
                    value: editedRecipe.time.value
                },
                ingredients: editedRecipe.ingredients,
                directions: editedRecipe.directions
            });
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            const index = recipes.findIndex(element => element.id === item.id);
            dispatch(editRecipe(index, editedRecipe)) // Update store
            navigation.goBack();
            setTimeout(() => {
                ToastAndroid.show(`${editedRecipe.name} נערך בהצלחה`, ToastAndroid.SHORT);
            }, 500);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 15 }}
            >
                <ScreenHeader text={`עריכת ${item.name}`} />
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <View style={styles.textInputWrapper}>
                        <Text style={styles.label}>שם המתכון</Text>
                        <TextInput
                            value={name}
                            ref={nameRef}
                            placeholder='איך קוראים למנה?'
                            onChangeText={(text) => setName(text)}
                            style={styles.textInput}
                            placeholderTextColor={placeholder}
                            underlineColorAndroid="transparent"
                            selectionColor={placeholder}
                            returnKeyType='next'
                            onSubmitEditing={() => quantityRef.current.focus()}
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <Text style={styles.label}>כמות מנות</Text>
                        <TextInput
                            value={quantity}
                            ref={quantityRef}
                            keyboardType='numeric'
                            placeholder='לכמה אנשים הוא מספיק?'
                            onChangeText={(text) => setQuantity(text)}
                            style={styles.textInput}
                            placeholderTextColor={placeholder}
                            underlineColorAndroid="transparent"
                            selectionColor={placeholder}
                            returnKeyType='next'
                            onSubmitEditing={() => categoryRef.current.focus()}
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.textInputWrapper}>
                        <Text style={styles.label}>קטגוריה</Text>
                        <TextInput
                            value={category}
                            ref={categoryRef}
                            placeholder='לאיזו קטגוריה הוא שייך?'
                            onChangeText={(text) => setCategory(text)}
                            style={styles.textInput}
                            placeholderTextColor={placeholder}
                            underlineColorAndroid="transparent"
                            selectionColor={placeholder}
                            returnKeyType='next'
                            onSubmitEditing={() => timeRef.current.focus()}
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={[styles.textInputWrapper, { paddingRight: 3 }]}>
                        <Text style={styles.label}>זמן הכנה</Text>
                        <View style={styles.timeWrapper}>
                            <TextInput
                                value={time.value}
                                ref={timeRef}
                                keyboardType='numeric'
                                placeholder='בכמה זמן מכינים אותו?'
                                onChangeText={(text) => {
                                    var updated = update(time, { value: { $set: text } });
                                    setTime(updated);
                                }}
                                style={styles.textInput}
                                placeholderTextColor={placeholder}
                                underlineColorAndroid="transparent"
                                selectionColor={placeholder}
                                returnKeyType='next'
                                onSubmitEditing={() => youtubeRef.current.focus()}
                                blurOnSubmit={false}
                            />
                            <RadioForm
                                radio_props={radio_props}
                                formHorizontal
                                initial={item.time.unit === 'שעות' ? 1 : 0}
                                onPress={(value) => {
                                    var updated = update(time, { unit: { $set: value } });
                                    setTime(updated);
                                }}
                                buttonColor={placeholder}
                                buttonSize={10}
                                selectedButtonColor={placeholder}
                                selectedLabelColor='white'
                                labelColor='white'
                                labelStyle={{ marginLeft: 10, fontSize: 17 }}
                                style={styles.radioForm}
                            />
                        </View>
                    </View>
                    <View style={styles.textInputWrapper}>
                        <Text style={styles.label}>לינק לסרטון</Text>
                        <TextInput
                            value={youtube}
                            ref={youtubeRef}
                            placeholder='אם יש סרטון, הכנס אותו כאן'
                            onChangeText={(text) => setYoutube(text)}
                            style={styles.textInput}
                            placeholderTextColor={placeholder}
                            underlineColorAndroid="transparent"
                            selectionColor={placeholder}
                            returnKeyType='next'
                            onSubmitEditing={() => ingredientRef.current.focus()}
                            blurOnSubmit={false}
                        />
                    </View>
                    <Text style={[styles.text, styles.title]}>מרכיבים</Text>
                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.dynamicInputWrapper}>
                            <View style={[styles.textInputWrapper, { marginBottom: 0 }]}>
                                <TextInput
                                    ref={ingredientRef}
                                    placeholder={`מרכיב ${index + 1}`}
                                    value={ingredient.title}
                                    onChangeText={(text) => handleIngredientTitleChange(text, index)}
                                    style={styles.textInput}
                                    placeholderTextColor={placeholder}
                                    underlineColorAndroid="transparent"
                                    selectionColor={placeholder}
                                    returnKeyType='next'
                                    onSubmitEditing={() => amountRef.current.focus()}
                                    blurOnSubmit={false}
                                />
                            </View>
                            <View style={[styles.textInputWrapper, { marginHorizontal: 5, marginBottom: 0 }]}>
                                <TextInput
                                    ref={amountRef}
                                    placeholder='כמות'
                                    value={ingredient.amount}
                                    onChangeText={(text) => handleIngredientAmountChange(text, index)}
                                    style={styles.textInput}
                                    placeholderTextColor={placeholder}
                                    underlineColorAndroid="transparent"
                                    selectionColor={placeholder}
                                    returnKeyType='next'
                                    onSubmitEditing={() => unitRef.current.focus()}
                                    blurOnSubmit={false}
                                />
                            </View>
                            <View style={[styles.textInputWrapper, { marginBottom: 0 }]}>
                                <TextInput
                                    ref={unitRef}
                                    placeholder='יחידה'
                                    value={ingredient.unit}
                                    onChangeText={(text) => handleIngredientUnitChange(text, index)}
                                    style={styles.textInput}
                                    placeholderTextColor={placeholder}
                                    underlineColorAndroid="transparent"
                                    selectionColor={placeholder}
                                    returnKeyType='next'
                                    onSubmitEditing={() => {
                                        if (index === ingredients.length - 1)
                                            directionRef.current.focus();
                                        else
                                            ingredientRef.current.focus();
                                    }}
                                    blurOnSubmit={false}
                                />
                            </View>
                            {ingredients.length - 1 === index &&
                                <TouchableOpacity
                                    onPress={() => handleAddIngredient()}
                                    style={styles.actionButton}
                                    activeOpacity={0.8}
                                >
                                    <AntDesign name="plus" size={12} color="blue" />
                                </TouchableOpacity>
                            }
                            {ingredients.length > 1 &&
                                <TouchableOpacity
                                    onPress={() => handleRemoveIngredient(index)}
                                    style={styles.actionButton}
                                    activeOpacity={0.8}
                                >
                                    <AntDesign name="minus" size={12} color="red" />
                                </TouchableOpacity>
                            }
                        </View>
                    ))}
                    <Text style={[styles.text, styles.title]}>הוראות הכנה</Text>
                    {directions.map((direction, index) => (
                        <View key={index} style={styles.dynamicInputWrapper}>
                            <View style={[styles.textInputWrapper, { marginBottom: 0 }]}>
                                <TextInput
                                    ref={directionRef}
                                    placeholder={`הוראה ${index + 1}`}
                                    value={direction.value}
                                    onChangeText={(text) => handleDirectionChange(text, index)}
                                    style={styles.textInput}
                                    placeholderTextColor={placeholder}
                                    underlineColorAndroid="transparent"
                                    selectionColor={placeholder}
                                    returnKeyType='go'
                                    blurOnSubmit={index === directions.length - 1 ? true : false}
                                    onSubmitEditing={() => {
                                        if (index === directions.length - 1)
                                            onEditRecipe();
                                        else
                                            directionRef.current?.focus();
                                    }}
                                />
                            </View>
                            {directions.length - 1 === index &&
                                <TouchableOpacity
                                    onPress={() => handleAddDirection(index)}
                                    style={styles.actionButton}
                                    activeOpacity={0.8}
                                >
                                    <AntDesign name="plus" size={12} color="blue" />
                                </TouchableOpacity>
                            }
                            {directions.length > 1 &&
                                <TouchableOpacity
                                    onPress={() => handleRemoveDirection(index)}
                                    style={styles.actionButton}
                                    activeOpacity={0.8}
                                >
                                    <AntDesign name="minus" size={12} color="red" />
                                </TouchableOpacity>
                            }
                        </View>
                    ))}
                    <TouchableOpacity
                        onPress={onEditRecipe}
                        style={styles.button}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.text}>עריכה</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditingScreen;

var radio_props = [
    { label: "דקה", value: "דקה" },
    { label: "שעה", value: "שעה" },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    textInputWrapper: {
        flex: 1,
        // height: 40,
        backgroundColor: primary,
        borderRadius: 15,
        // flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        //elevation: 1,
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    label: {
        // fontFamily: 'Alef',
        color: 'white'
    },
    textInput: {
        // fontFamily: 'Alef',
        fontSize: 16,
        color: 'white',
        textAlign: 'right',
        justifyContent: 'flex-start',
        flex: 1,
        width: '100%'
    },
    dynamicInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    text: {
        // fontFamily: 'AlefBold',
        color: 'white',
        fontSize: 17,
        letterSpacing: 1.2
    },
    actionButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        elevation: 2
    },
    timeWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    radioForm: {
        marginLeft: 15,
    },
    button: {
        backgroundColor: secondary,
        borderRadius: 15,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        elevation: 1
    },
    title: {
        // fontFamily: 'AlefBold',
        fontSize: 20,
        color: 'white',
        marginBottom: 5
    }
});