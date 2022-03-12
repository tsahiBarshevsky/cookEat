import React, { useState, useRef } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Modalize as BottomSheet } from 'react-native-modalize';
import { hover, placeholder, primary, secondary } from '../../utils/palette';

// firabse
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

const DURATION = 150;

const ActionsBar = ({ size }) => {
    const [pressed, setPressed] = useState(false);
    const [pressedAdd, setPressedAdd] = useState(false);
    const [pressedFavorite, setPressedFavorite] = useState(false);
    const [pressedLogout, setPressedLogout] = useState(false);
    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();

    const onNavigate = (route) => {
        bottomSheetRef.current?.close();
        setTimeout(() => {
            navigation.navigate(`${route}`);
        }, DURATION + 50);
    }

    const onSignOut = () => {
        bottomSheetRef.current?.close();
        signOut(authentication);
        setTimeout(() => {
            navigation.replace('Login');
        }, DURATION + 50);
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => bottomSheetRef.current?.open()}
                    onPressIn={() => setPressed(true)}
                    onPressOut={() => setPressed(false)}
                    style={[styles.wrapper, pressed && styles.button]}
                >
                    <Feather name="menu" size={24} color="rgba(255, 255, 255, 0.8)" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Search", { size })}
                    activeOpacity={1}
                    style={styles.searchButton}
                >
                    <Text style={styles.placeholder}>
                        חיפוש מבין {size} מתכונים...
                    </Text>
                </TouchableOpacity>
                <View style={[styles.wrapper, styles.image]}>
                    <Image
                        source={{ uri: authentication.currentUser.photoURL }}
                        style={{ height: 30, width: 30 }}
                        resizeMode='cover'
                    />
                </View>
            </View>
            <BottomSheet
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
                    <View style={styles.emailWrapper}>
                        <Text style={[styles.text, styles.email]}>
                            {authentication.currentUser.email}
                        </Text>
                    </View>
                    <View style={{ paddingHorizontal: 15 }}>
                        <View style={styles.seperator} />
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => onNavigate('Insertion')}
                            onPressIn={() => setPressedAdd(true)}
                            onPressOut={() => setPressedAdd(false)}
                            style={[styles.BSButton, pressedAdd && styles.buttonHover]}
                            activeOpacity={1}
                        >
                            <View style={styles.icon}>
                                <MaterialIcons name="post-add" size={22} color="white" />
                            </View>
                            <Text style={styles.text}>הוספת מתכון חדש</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => onNavigate('Favorites')}
                            onPressIn={() => setPressedFavorite(true)}
                            onPressOut={() => setPressedFavorite(false)}
                            style={[styles.BSButton, pressedFavorite && styles.buttonHover]}
                            activeOpacity={1}
                        >
                            <View style={styles.icon}>
                                <FontAwesome name="bookmark" size={18} color="white" />
                            </View>
                            <Text style={styles.text}>מתכונים מועדפים</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => onSignOut()}
                            onPressIn={() => setPressedLogout(true)}
                            onPressOut={() => setPressedLogout(false)}
                            style={[styles.BSButton, pressedLogout && styles.buttonHover]}
                            activeOpacity={1}
                        >
                            <View style={styles.icon}>
                                <MaterialIcons style={{ transform: [{ translateX: 3 }] }} name="logout" size={20} color="white" />
                            </View>
                            <Text style={styles.text}>התנתקות מהחשבון</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </>
    )
}

export default ActionsBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: primary,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        height: 50,
        elevation: 2
    },
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
    },
    wrapper: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    image: {
        backgroundColor: secondary,
    },
    button: {
        backgroundColor: '#28313680',
    },
    text: {
        color: 'white'
    },
    placeholder: {
        color: placeholder
    },
    email: {
        fontSize: 17,
        textAlign: 'center',
        letterSpacing: 1,
        flexShrink: 1
    },
    emailWrapper: {
        alignItems: 'center',
        marginBottom: 5
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
        height: 45,
        paddingHorizontal: 15
    },
    buttonHover: {
        backgroundColor: hover
    },
    searchButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }
});