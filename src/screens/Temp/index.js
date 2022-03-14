import React, { useState, useEffect, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import uuid from 'react-native-uuid';
import RadioForm from 'react-native-simple-radio-button';
import { AntDesign, Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import update from 'immutability-helper';
import { UIActivityIndicator } from 'react-native-indicators';
import { SharedElement } from 'react-navigation-shared-element';
import { Formik, FieldArray, ErrorMessage, getIn } from 'formik';
import Toast from 'react-native-toast-message';
import { addNewRecipe } from '../../redux/actions/recipes';
import { recipeSchema } from '../../utils/recipeSchema';
import { background, primary, secondary, placeholder } from '../../utils/palette';
import config from '../../utils/config';

// React native components
import {
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text,
    Platform,
    TextInput,
    View,
    KeyboardAvoidingView
} from 'react-native';

// firebase
import { doc, setDoc } from 'firebase/firestore/lite';
import { authentication, db } from '../../utils/firebase';

const TempScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [formKey, setFormKey] = useState(0);
    const [disabled, setDisabled] = useState(false);

    // References for next textInput
    const nameRef = useRef(null);
    const quantityRef = useRef(null);
    const categoryRef = useRef(null);
    const timeRef = useRef(null);
    const ingredientRef = useRef(null);
    const amountRef = useRef(null);
    const unitRef = useRef(null);
    const directionRef = useRef(null);

    const onAddNewRecipe = async (newRecipe) => {
        console.log("directions:", newRecipe.directions);
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
                    <Text style={styles.headerText}>הוספת מתכון</Text>
                </View>
                {!image ?
                    <TouchableOpacity
                        onPress={() => pickImage()}
                        activeOpacity={0.8}
                        style={styles.upload}
                    >
                        <MaterialCommunityIcons name="image-plus" size={20} color="#FFFFFF99" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ImagePreview', { image, origin })}
                        onLongPress={() => pickImage()}
                        activeOpacity={0.8}
                    >
                        <SharedElement id={`image-preview.${origin}`}>
                            <Image source={{ uri: image }} style={styles.image} resizeMode='cover' />
                        </SharedElement>
                    </TouchableOpacity>
                }
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
                        initialValues={{ name: '', quantity: '', category: '', time: { value: '', unit: 'דקה' }, ingredients: [{ title: '', amount: '', unit: '' }], directions: [''] }}
                        enableReinitialize
                        onSubmit={(values) => onAddNewRecipe(values)}
                        validationSchema={recipeSchema}
                    >
                        {({ handleChange, handleSubmit, handleBlur, values, errors, setErrors, touched, resetForm }) => {
                            // console.log("errors:", errors.ingredients)
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
                                    {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
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
                                    {touched.quantity && errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}
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
                                    {touched.category && errors.category && <Text style={styles.error}>{errors.category}</Text>}
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
                                                initial={0}
                                                onPress={handleChange('time.unit')}
                                                buttonColor={placeholder}
                                                buttonSize={10}
                                                selectedButtonColor={placeholder}
                                                selectedLabelColor='white'
                                                labelColor='white'
                                                labelStyle={{ marginLeft: 10, fontSize: 17 }}
                                                key={formKey}
                                                style={styles.radioForm}
                                            />
                                        </View>
                                    </View>
                                    {touched.time && errors.time && <Text style={styles.error}>{errors.time.value}</Text>}
                                    <Text style={[styles.text, styles.title]}>מרכיבים</Text>
                                    <FieldArray
                                        name='ingredients'
                                        render={(arrayHelpers) => {
                                            const ingredients = values.ingredients;
                                            return (
                                                ingredients.map((ingredient, index) => {
                                                    if (errors.ingredients)
                                                        console.log(index, errors.ingredients[index])
                                                    // if (errors.ingredients)
                                                    //     if (errors.ingredients[index].includes(undefined))
                                                    //         // console.log(`ingredients[${index}]`, errors.ingredients[index].title);
                                                    //         console.log('yes')
                                                    //     else
                                                    //         console.log('no')
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
                                                                // <Text style={styles.error}>
                                                                <ErrorMessage
                                                                    name={`ingredients.${index}.title`}
                                                                    render={msg => <Text style={styles.error}>{msg}</Text>}
                                                                />
                                                                // </Text>
                                                            }
                                                            {touched.ingredients && errors.ingredients && errors.ingredients[index] &&
                                                                // <Text style={styles.error}>
                                                                <ErrorMessage
                                                                    name={`ingredients.${index}.amount`}
                                                                    render={msg => <Text style={styles.error}>{msg}</Text>}
                                                                />
                                                                // </Text>
                                                            }
                                                            {touched.ingredients && errors.ingredients && errors.ingredients[index] &&
                                                                // <Text style={styles.error}>
                                                                <ErrorMessage
                                                                    name={`ingredients.${index}.unit`}
                                                                    render={msg => <Text style={styles.error}>{msg}</Text>}
                                                                />
                                                                // </Text>
                                                            }
                                                            {/* {touched.ingredients && errors.ingredients &&
                                                        <Text style={styles.error}>
                                                            <ErrorMessage name={`ingredients.${index}.amount`} />
                                                        </Text>
                                                    }
                                                    {touched.ingredients && errors.ingredients &&
                                                        <Text style={styles.error}>
                                                            <ErrorMessage name={`ingredients.${index}.unit`} />
                                                        </Text>
                                                    } */}
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
                                                            // <Text style={styles.error}>
                                                            <ErrorMessage
                                                                name={`directions.${index}`}
                                                                render={msg => <Text style={styles.error}>{msg}</Text>}
                                                            />
                                                            // </Text>
                                                        }
                                                        {/* {touched.directions && errors.directions &&
                                                            <Text style={styles.error}>
                                                                <ErrorMessage name={`directions.${index}`} />
                                                            </Text>
                                                        } */}
                                                    </View>
                                                ))
                                            );
                                        }}
                                    />
                                    <View style={styles.buttons}>
                                        <TouchableOpacity
                                            onPress={handleSubmit}
                                            style={[styles.button, styles.add]}
                                            activeOpacity={0.8}
                                            disabled={disabled}
                                        >
                                            {!disabled ?
                                                <Text style={styles.text}>הוספה</Text>
                                                :
                                                <UIActivityIndicator size={25} count={12} color='white' />
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={resetForm}
                                            style={[styles.button, styles.clear]}
                                            activeOpacity={0.8}
                                            disabled={disabled}
                                        >
                                            <Text style={styles.text}>ניקוי</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }}
                    </Formik>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView >
    )
}

export default TempScreen;

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
        // marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 10
    },
    label: {
        color: 'white'
    },
    error: {
        color: 'red',
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
        // marginBottom: 10
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
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15
    },
    button: {
        borderRadius: 15,
        height: 35,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
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
        // marginVertical: 10
    }
});