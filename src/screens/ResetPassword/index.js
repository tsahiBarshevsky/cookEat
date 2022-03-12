import React, { useState } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { UIActivityIndicator } from 'react-native-indicators';
import { authentication } from '../../utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { background, primary, secondary, placeholder } from '../../utils/palette';

// React Native components
import {
    StyleSheet,
    Platform,
    StatusBar,
    SafeAreaView,
    TextInput,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';

const ResetPasswordScreen = () => {
    const [disabled, setDisabled] = useState(false);
    const [email, setEmail] = useState('');

    const notify = (message) => {
        console.log(message);
        setDisabled(false);
        switch (message) {
            case 'Firebase: Error (auth/missing-email).':
                Toast.show({
                    type: 'snackbar',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        type: 'error',
                        text1: 'שגיאה',
                        text2: 'לא הכנסת מייל'
                    }
                });
                break;
            case 'Firebase: Error (auth/invalid-email).':
                Toast.show({
                    type: 'snackbar',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        type: 'error',
                        text1: 'שגיאה',
                        text2: 'כתובת מייל אינה תקינה'
                    }
                });
                break;
            case 'Firebase: Error (auth/user-not-found).':
                Toast.show({
                    type: 'snackbar',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        type: 'error',
                        text1: 'שגיאה',
                        text2: 'לא נמצא משתמש עם המייל הזה'
                    }
                });
                break;
            default:
                return null;
        }
    }

    const onRequestPasswordReset = () => {
        setDisabled(true);
        sendPasswordResetEmail(authentication, email)
            .catch((error) => notify(error.message))
            .finally(() => {
                setDisabled(false);
                setEmail('');
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ExpoStatusBar style='light' />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 15 }}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Image
                        source={require('../../../assets/images/password.png')}
                        resizeMode='contain'
                        style={styles.image}
                    />
                    <Text style={[styles.text, styles.route]}>איפוס סיסמה</Text>
                    <Text style={[styles.text, { marginBottom: 15 }]}>
                        שכחת סיסמה? לא נורא, זה קורה. הכנס את המייל שאיתו נרשמת ונשלח לך מייל לאיפוס סיסמה.
                    </Text>
                    <View style={styles.textInputWrapper}>
                        <MaterialIcons
                            name="alternate-email"
                            size={20}
                            color="white"
                            style={styles.icon}
                        />
                        <TextInput
                            value={email}
                            placeholder='עם איזה מייל נרשמת?'
                            onChangeText={(text) => setEmail(text)}
                            keyboardType='email-address'
                            placeholderTextColor={placeholder}
                            underlineColorAndroid="transparent"
                            selectionColor={placeholder}
                            onSubmitEditing={() => onRequestPasswordReset()}
                            style={styles.textInput}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={onRequestPasswordReset}
                        style={styles.button}
                        activeOpacity={0.8}
                        disabled={disabled}
                    >
                        {disabled ?
                            <UIActivityIndicator size={25} count={12} color='white' />
                            :
                            <Text style={[styles.text, styles.buttonText]}>
                                שלח מייל
                            </Text>
                        }
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: background,
        paddingHorizontal: 15
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 40
    },
    headerText: {
        color: 'white',
        fontSize: 17,
        flexShrink: 1
    },
    text: {
        color: 'white'
    },
    route: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10
    },
    image: {
        height: 230,
        width: 230,
        alignSelf: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 5
    },
    textInputWrapper: {
        height: 45,
        backgroundColor: primary,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        elevation: 2
    },
    icon: {
        marginRight: 10
    },
    textInput: {
        fontSize: 16,
        color: 'white',
        textAlign: 'right',
        justifyContent: 'flex-start',
        flex: 1,
        width: '100%',
    },
    button: {
        backgroundColor: secondary,
        borderRadius: 15,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        elevation: 2
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1
    }
});