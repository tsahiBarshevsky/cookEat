import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-native-uuid';
import RadioForm from 'react-native-simple-radio-button';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import update from 'immutability-helper';
import { UIActivityIndicator } from 'react-native-indicators';
import { SharedElement } from 'react-navigation-shared-element';
import Toast from 'react-native-toast-message';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import { useSelector } from 'react-redux';
import { editRecipe } from '../../redux/actions/recipes';
import { recipeSchema } from '../../utils/recipeSchema';
import { background, primary, secondary, placeholder, error } from '../../utils/palette';

// React native components
import {
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    Platform,
    StatusBar,
    TextInput,
    View,
    KeyboardAvoidingView
} from 'react-native';

// firebase
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../utils/firebase';

const EditingScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const recipes = useSelector(state => state.recipes);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();

    const origin = 'Editing';
    const initialValues = {
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        time: item.time,
        ingredients: item.ingredients,
        directions: item.directions
    };

    // References for next textInput
    const nameRef = useRef(null);
    const quantityRef = useRef(null);
    const categoryRef = useRef(null);
    const timeRef = useRef(null);
    const ingredientRef = useRef(null);
    const amountRef = useRef(null);
    const unitRef = useRef(null);
    const directionRef = useRef(null);

    const onEditRecipe = async (editedRecipe) => {
        setDisabled(true);
        editedRecipe.time.unit = editedRecipe.time.value > 1 ?
            (editedRecipe.time.unit === 'דקה' ? 'דקות' : 'שעות')
            :
            (editedRecipe.time.unit === 'דקה' ? 'דקה' : 'שעה');
        const recipeRef = doc(db, "recipes", item.id);
        try {
            // Update document on Firestore
            await updateDoc(recipeRef, {
                name: editedRecipe.name,
                quantity: editedRecipe.quantity,
                category: editedRecipe.category,
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
                Toast.show({
                    type: 'recipeToast',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        message: 'המתכון נערך בהצלחה',
                        image: item.image.url
                    }
                });
            }, 500);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                        style={styles.headerButton}
                    >
                        <Entypo style={{ transform: [{ translateY: 1 }] }} name="chevron-right" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>
                        עריכת {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ImagePreview', { image: item.image.url, origin })}
                    activeOpacity={0.8}
                >
                    <SharedElement id={`image-preview.${origin}`}>
                        <Image source={{ uri: item.image.url }} style={styles.image} resizeMode='cover' />
                    </SharedElement>
                </TouchableOpacity>
            </View>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 15 }}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        onSubmit={(values) => onEditRecipe(values)}
                        validationSchema={recipeSchema}
                    >
                        {({ handleChange, handleSubmit, handleBlur, values, errors, setErrors, touched, resetForm }) => {
                            return (
                                <View>
                                    <View style={[styles.textInputWrapper, { marginTop: 0 }]}>
                                        <Text style={styles.label}>שם המתכון</Text>
                                        <TextInput
                                            value={values.name}
                                            ref={nameRef}
                                            placeholder='איך קוראים למנה?'
                                            onChangeText={handleChange('name')}
                                            style={styles.textInput}
                                            placeholderTextColor={placeholder}
                                            underlineColorAndroid="transparent"
                                            selectionColor={placeholder}
                                            returnKeyType='next'
                                            onSubmitEditing={() => quantityRef.current.focus()}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('name')}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='name'
                                        render={(message) => {
                                            return (
                                                <View style={styles.errorContainer}>
                                                    <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color={error} />
                                                    <Text style={styles.error}>{message}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    <View style={styles.textInputWrapper}>
                                        <Text style={styles.label}>כמות מנות</Text>
                                        <TextInput
                                            value={values.quantity}
                                            ref={quantityRef}
                                            keyboardType='numeric'
                                            placeholder='לכמה אנשים הוא מספיק?'
                                            onChangeText={handleChange('quantity')}
                                            style={styles.textInput}
                                            placeholderTextColor={placeholder}
                                            underlineColorAndroid="transparent"
                                            selectionColor={placeholder}
                                            returnKeyType='next'
                                            onSubmitEditing={() => categoryRef.current.focus()}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('quantity')}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='quantity'
                                        render={(message) => {
                                            return (
                                                <View style={styles.errorContainer}>
                                                    <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color={error} />
                                                    <Text style={styles.error}>{message}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    <View style={styles.textInputWrapper}>
                                        <Text style={styles.label}>קטגוריה</Text>
                                        <TextInput
                                            value={values.category}
                                            ref={categoryRef}
                                            placeholder='לאיזו קטגוריה הוא שייך?'
                                            onChangeText={handleChange('category')}
                                            style={styles.textInput}
                                            placeholderTextColor={placeholder}
                                            underlineColorAndroid="transparent"
                                            selectionColor={placeholder}
                                            returnKeyType='next'
                                            onSubmitEditing={() => timeRef.current.focus()}
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('category')}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='category'
                                        render={(message) => {
                                            return (
                                                <View style={styles.errorContainer}>
                                                    <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color={error} />
                                                    <Text style={styles.error}>{message}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    <View style={[styles.textInputWrapper, { paddingRight: 3 }]}>
                                        <Text style={styles.label}>זמן הכנה</Text>
                                        <View style={styles.timeWrapper}>
                                            <TextInput
                                                value={values.time.value}
                                                ref={timeRef}
                                                keyboardType='numeric'
                                                placeholder='בכמה זמן מכינים אותו?'
                                                onChangeText={handleChange('time.value')}
                                                style={styles.textInput}
                                                placeholderTextColor={placeholder}
                                                underlineColorAndroid="transparent"
                                                selectionColor={placeholder}
                                                returnKeyType='next'
                                                onSubmitEditing={() => ingredientRef.current.focus()}
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('time.value')}
                                            />
                                            <RadioForm
                                                radio_props={radio_props}
                                                formHorizontal
                                                initial={item.time.unit === 'שעות' ? 1 : 0}
                                                onPress={handleChange('time.unit')}
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
                                    <ErrorMessage
                                        name='time.value'
                                        render={(message) => {
                                            return (
                                                <View style={styles.errorContainer}>
                                                    <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color={error} />
                                                    <Text style={styles.error}>{message}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    <Text style={[styles.text, styles.title]}>מרכיבים</Text>
                                    <FieldArray
                                        name='ingredients'
                                        render={(arrayHelpers) => {
                                            const ingredients = values.ingredients;
                                            return (
                                                ingredients.map((ingredient, index) => {
                                                    return (
                                                        <View key={index}>
                                                            <View style={styles.dynamicInputWrapper}>
                                                                <View style={[styles.textInputWrapper, { marginBottom: 0 }]}>
                                                                    <TextInput
                                                                        ref={ingredientRef}
                                                                        placeholder={`מרכיב ${index + 1}`}
                                                                        value={values.ingredients[index].title}
                                                                        onChangeText={handleChange(`ingredients.${index}.title`)}
                                                                        style={styles.textInput}
                                                                        placeholderTextColor={placeholder}
                                                                        underlineColorAndroid="transparent"
                                                                        selectionColor={placeholder}
                                                                        returnKeyType='next'
                                                                        onSubmitEditing={() => amountRef.current.focus()}
                                                                        blurOnSubmit={false}
                                                                        onBlur={handleBlur(`ingredients.${index}.title`)}
                                                                    />
                                                                </View>
                                                                <View style={[styles.textInputWrapper, { marginHorizontal: 5, marginBottom: 0 }]}>
                                                                    <TextInput
                                                                        ref={amountRef}
                                                                        placeholder='כמות'
                                                                        value={values.ingredients[index].amount}
                                                                        onChangeText={handleChange(`ingredients.${index}.amount`)}
                                                                        style={styles.textInput}
                                                                        placeholderTextColor={placeholder}
                                                                        underlineColorAndroid="transparent"
                                                                        selectionColor={placeholder}
                                                                        returnKeyType='next'
                                                                        onSubmitEditing={() => unitRef.current.focus()}
                                                                        blurOnSubmit={false}
                                                                        onBlur={handleBlur(`ingredients.${index}.amount`)}
                                                                    />
                                                                </View>
                                                                <View style={[styles.textInputWrapper, { marginBottom: 0 }]}>
                                                                    <TextInput
                                                                        ref={unitRef}
                                                                        placeholder='יחידה'
                                                                        value={values.ingredients[index].unit}
                                                                        onChangeText={handleChange(`ingredients.${index}.unit`)}
                                                                        style={styles.textInput}
                                                                        placeholderTextColor={placeholder}
                                                                        underlineColorAndroid="transparent"
                                                                        selectionColor={placeholder}
                                                                        returnKeyType='next'
                                                                        onSubmitEditing={() => {
                                                                            if (index === values.ingredients.length - 1)
                                                                                directionRef.current.focus();
                                                                            else
                                                                                ingredientRef.current.focus();
                                                                        }}
                                                                        blurOnSubmit={false}
                                                                        onBlur={handleBlur(`ingredients.${index}.unit`)}
                                                                    />
                                                                </View>
                                                                {ingredients.length - 1 === index &&
                                                                    <TouchableOpacity
                                                                        onPress={() => arrayHelpers.push({ title: '', amount: '', unit: '' })}
                                                                        style={styles.actionButton}
                                                                        activeOpacity={0.8}
                                                                    >
                                                                        <AntDesign name="plus" size={12} color="blue" />
                                                                    </TouchableOpacity>
                                                                }
                                                                {ingredients.length > 1 &&
                                                                    <TouchableOpacity
                                                                        onPress={() => arrayHelpers.remove(index)}
                                                                        style={styles.actionButton}
                                                                        activeOpacity={0.8}
                                                                    >
                                                                        <AntDesign name="minus" size={12} color="red" />
                                                                    </TouchableOpacity>
                                                                }
                                                            </View>
                                                            {touched.ingredients && errors.ingredients && errors.ingredients[index] &&
                                                                <ErrorMessage
                                                                    name={`ingredients.${index}.title`}
                                                                    render={(message) => {
                                                                        return (
                                                                            <View style={styles.errorContainer}>
                                                                                <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color={error} />
                                                                                <Text style={styles.error}>{message}</Text>
                                                                            </View>
                                                                        )
                                                                    }}
                                                                />
                                                            }
                                                            {touched.ingredients && errors.ingredients && errors.ingredients[index] &&
                                                                <ErrorMessage
                                                                    name={`ingredients.${index}.amount`}
                                                                    render={(message) => {
                                                                        return (
                                                                            <View style={styles.errorContainer}>
                                                                                <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color={error} />
                                                                                <Text style={styles.error}>{message}</Text>
                                                                            </View>
                                                                        )
                                                                    }}
                                                                />
                                                            }
                                                            {touched.ingredients && errors.ingredients && errors.ingredients[index] &&
                                                                <ErrorMessage
                                                                    name={`ingredients.${index}.unit`}
                                                                    render={(message) => {
                                                                        return (
                                                                            <View style={styles.errorContainer}>
                                                                                <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color={error} />
                                                                                <Text style={styles.error}>{message}</Text>
                                                                            </View>
                                                                        )
                                                                    }}
                                                                />
                                                            }
                                                        </View>
                                                    )
                                                })
                                            );
                                        }}
                                    />
                                    <Text style={[styles.text, styles.title]}>הוראות הכנה</Text>
                                    <FieldArray
                                        name='directions'
                                        render={(arrayHelpers) => {
                                            const directions = values.directions;
                                            return (
                                                directions.map((direction, index) => (
                                                    <View key={index}>
                                                        <View style={styles.dynamicInputWrapper}>
                                                            <View style={[styles.textInputWrapper, { marginBottom: 0 }]}>
                                                                <TextInput
                                                                    ref={directionRef}
                                                                    placeholder={`הוראה ${index + 1}`}
                                                                    value={values.directions[index]}
                                                                    onChangeText={handleChange(`directions.${index}`)}
                                                                    style={styles.textInput}
                                                                    placeholderTextColor={placeholder}
                                                                    underlineColorAndroid="transparent"
                                                                    selectionColor={placeholder}
                                                                    returnKeyType='next'
                                                                    onSubmitEditing={() => {
                                                                        if (index === directions.length - 1)
                                                                            handleSubmit();
                                                                        else
                                                                            directionRef.current?.focus();
                                                                    }}
                                                                    blurOnSubmit={false}
                                                                    onBlur={handleBlur(`directions.${index}`)}
                                                                />
                                                            </View>
                                                            {directions.length - 1 === index &&
                                                                <TouchableOpacity
                                                                    onPress={() => arrayHelpers.push('')}
                                                                    style={styles.actionButton}
                                                                    activeOpacity={0.8}
                                                                >
                                                                    <AntDesign name="plus" size={12} color="blue" />
                                                                </TouchableOpacity>
                                                            }
                                                            {directions.length > 1 &&
                                                                <TouchableOpacity
                                                                    onPress={() => arrayHelpers.remove(index)}
                                                                    style={styles.actionButton}
                                                                    activeOpacity={0.8}
                                                                >
                                                                    <AntDesign name="minus" size={12} color="red" />
                                                                </TouchableOpacity>
                                                            }
                                                        </View>
                                                        {touched.directions && errors.directions &&
                                                            <ErrorMessage
                                                                name={`directions.${index}`}
                                                                render={(message) => {
                                                                    return (
                                                                        <View style={styles.errorContainer}>
                                                                            <Ionicons style={styles.errorIcon} name="warning-outline" size={15} color={error} />
                                                                            <Text style={styles.error}>{message}</Text>
                                                                        </View>
                                                                    )
                                                                }}
                                                            />
                                                        }
                                                    </View>
                                                ))
                                            );
                                        }}
                                    />
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={[styles.button, styles.add]}
                                        activeOpacity={0.8}
                                        disabled={disabled}
                                    >
                                        {!disabled ?
                                            <Text style={styles.text}>עריכה</Text>
                                            :
                                            <UIActivityIndicator size={25} count={12} color='white' />
                                        }
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    </Formik>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 60
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
    upload: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: secondary
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 10
    },
    textInputWrapper: {
        flex: 1,
        backgroundColor: primary,
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 10
    },
    label: {
        color: 'white'
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    errorIcon: {
        marginRight: 5
    },
    error: {
        color: error,
        fontWeight: 'bold'
    },
    textInput: {
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
    },
    text: {
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
        elevation: 2,
        marginTop: 10
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
        marginTop: 15,
        elevation: 1,
    },
    add: {
        backgroundColor: secondary,
    },
    clear: {
        borderColor: secondary,
        borderWidth: 1
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    }
});