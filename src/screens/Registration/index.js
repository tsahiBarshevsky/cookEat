import React, { useEffect, useRef, useState } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { authentication } from '../../utils/firebase';
import { background, primary, secondary, placeholder, selected } from '../../utils/palette';
import { avatars } from '../../utils/avatars';

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
    FlatList
} from 'react-native';

const RegistrationScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibilty, setPasswordVisibilty] = useState(true);
    const [avatar, setAvatar] = useState(1);
    const passwordRef = useRef(null);

    const notify = (message) => {
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
            case 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).':
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
            default:
                return null;
        }
    }

    const onRegister = () => {
        createUserWithEmailAndPassword(authentication, email, password)
            .then(() => {
                updateProfile(
                    authentication.currentUser,
                    { photoURL: avatars[avatar - 1].url }
                );
            })
            .catch((error) => notify(error.message));
    }

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user)
                navigation.replace('Splash');
        });
        return unsubscribe;
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ExpoStatusBar style='light' />
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                        style={styles.headerButton}
                    >
                        <Entypo style={{ transform: [{ translateY: 1 }] }} name="chevron-right" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>חזרה להתחברות</Text>
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 15 }}
            >
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <View style={styles.logo}>
                        <View style={styles.line} />
                        <Text style={styles.logoText}>Cook Eat</Text>
                        <View style={styles.line} />
                    </View>
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
                            placeholder='מהי כתובת המייל שלך?'
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
                            placeholder='חייבת להכיל 6 תווים לפחות'
                            secureTextEntry={passwordVisibilty}
                            onChangeText={(text) => setPassword(text)}
                            placeholderTextColor={placeholder}
                            underlineColorAndroid="transparent"
                            selectionColor={placeholder}
                            onSubmitEditing={() => onRegister()}
                            blurOnSubmit={false}
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
                    <Text style={[styles.text, styles.title]}>בחירת אווטאר</Text>
                    <FlatList
                        data={avatars}
                        key={(item) => item.key}
                        horizontal
                        contentContainerStyle={{ paddingBottom: 7 }}
                        ItemSeparatorComponent={() => <View style={{ paddingHorizontal: 5 }} />}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => setAvatar(item.key)}
                                    style={[
                                        styles.avatar,
                                        avatar === item.key ?
                                            styles.selected
                                            :
                                            styles.unselected
                                    ]}
                                    activeOpacity={0.9}
                                >
                                    <Image
                                        source={{ uri: item.url }}
                                        style={{ height: 50, width: 50 }}
                                        resizeMode='cover'
                                    />
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <TouchableOpacity
                        onPress={onRegister}
                        style={styles.button}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.text, styles.buttonText]}>
                            צור לי חשבון!
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RegistrationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: background,
        paddingHorizontal: 15,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1
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
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
    },
    line: {
        width: '85%',
        height: 2,
        borderRadius: 1,
        backgroundColor: 'white'
    },
    logoText: {
        fontFamily: 'BilboSwashCaps',
        fontSize: 45,
        color: 'white'
    }
});