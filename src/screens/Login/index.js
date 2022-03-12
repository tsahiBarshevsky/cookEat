import React, { useEffect, useState, useRef } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { BallIndicator, UIActivityIndicator } from 'react-native-indicators';
import { authentication } from '../../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { background, primary, secondary, placeholder, selected } from '../../utils/palette';

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
    TouchableOpacity,
    Keyboard
} from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [loaded, setLoaded] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibilty, setPasswordVisibilty] = useState(true);
    const passwordRef = useRef(null);

    const notify = (message) => {
        console.log(message);
        setDisabled(false);
        switch (message) {
            case 'Firebase: Password should be at least 6 characters (auth/weak-password).':
                Toast.show({
                    type: 'snackbar',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        type: 'error',
                        text1: 'שגיאה',
                        text2: 'הסיסמה צריכה להכיל לפחות 6 תווים'
                    }
                });
                break;
            case 'Firebase: Error (auth/email-already-in-use).':
                Toast.show({
                    type: 'snackbar',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        type: 'error',
                        text1: 'שגיאה',
                        text2: 'המייל תפוס על ידי משתמש אחר'
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
                        text2: 'פורמט המייל אינו תקין'
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
                        text2: 'המייל לא תקין או לא נמצא במערכת'
                    }
                });
                break;
            case 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).':
                Toast.show({
                    type: 'snackbar',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        type: 'error',
                        text1: 'שגיאה',
                        text2: 'הסיסמה לא תקינה או לא נכונה'
                    }
                });
                break;
            case 'Firebase: Error (auth/internal-error).':
                Toast.show({
                    type: 'snackbar',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        type: 'error',
                        text1: 'שגיאה',
                        text2: 'בדוק את הערכים שהכנסת'
                    }
                });
                break;
            case 'Firebase: Error (auth/wrong-password).':
                Toast.show({
                    type: 'snackbar',
                    position: 'bottom',
                    bottomOffset: 20,
                    props: {
                        type: 'error',
                        text1: 'שגיאה',
                        text2: 'הסיסמה אינה נכונה'
                    }
                });
                break;
            default:
                return null;
        }
    }

    const onSignIn = () => {
        setDisabled(true);
        signInWithEmailAndPassword(authentication, email, password)
            .then(() => navigation.replace('Splash'))
            .catch((error) => notify(error.message));
    }

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user)
                navigation.replace('Splash');
            else
                setTimeout(() => {
                    setLoaded(true);
                }, 1000);
        });
        return unsubscribe;
    }, []);

    return loaded ? (
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
                        source={require('../../../assets/images/authentication.png')}
                        resizeMode='contain'
                        style={styles.image}
                    />
                    <Text style={[styles.text, styles.route]}>התחברות</Text>
                    <Text style={[styles.text, styles.title]}>אימייל</Text>
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
                            returnKeyType='next'
                            onSubmitEditing={() => passwordRef.current.focus()}
                            blurOnSubmit={false}
                            style={styles.textInput}
                        />
                    </View>
                    <Text style={[styles.text, styles.title]}>סיסמה</Text>
                    <View style={styles.textInputWrapper}>
                        <Entypo
                            name="lock"
                            size={20}
                            color="white"
                            style={styles.icon}
                        />
                        <TextInput
                            value={password}
                            ref={passwordRef}
                            placeholder='מה הסיסמה שלך?'
                            secureTextEntry={passwordVisibilty}
                            onChangeText={(text) => setPassword(text)}
                            placeholderTextColor={placeholder}
                            underlineColorAndroid="transparent"
                            selectionColor={placeholder}
                            onSubmitEditing={() => onSignIn()}
                            style={styles.textInput}
                        />
                        <TouchableOpacity onPress={() => setPasswordVisibilty(!passwordVisibilty)}>
                            {passwordVisibilty ?
                                <FontAwesome
                                    name="eye"
                                    size={20}
                                    color="rgba(255, 255, 255, 0.75)"
                                    style={styles.eye}
                                />
                                :
                                <FontAwesome
                                    name="eye-slash"
                                    size={20}
                                    color="rgba(255, 255, 255, 0.75)"
                                    style={styles.eye}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ResetPassword')}
                        style={styles.password}
                        activeOpacity={1}
                    >
                        <Text style={styles.text}>שכחת סיסמה?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onSignIn}
                        style={styles.button}
                        activeOpacity={0.8}
                        disabled={disabled}
                    >
                        {disabled ?
                            <UIActivityIndicator size={25} count={12} color='white' />
                            :
                            <Text style={[styles.text, styles.buttonText]}>
                                התחברות
                            </Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Registration')}
                        style={styles.registration}
                        activeOpacity={1}
                    >
                        <Text style={styles.text}>פעם ראשונה כאן? צור חשבון חדש</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    ) : (
        <SafeAreaView style={styles.loadingContainer}>
            <ExpoStatusBar style='light' />
            <BallIndicator size={30} count={8} color='white' />
        </SafeAreaView>
    )
}

export default LoginScreen;

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
        height: 250,
        width: 250,
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
    eye: {
        marginLeft: 10
    },
    avatar: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    selected: {
        backgroundColor: secondary
    },
    unselected: {
        backgroundColor: selected
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
    },
    password: {
        marginTop: -6,
        marginBottom: 2
    },
    registration: {
        marginTop: 10,
        alignSelf: 'center'
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: background,
        justifyContent: 'center',
        alignItems: 'center'
    }
});