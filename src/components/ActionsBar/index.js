import React, { useState, useRef } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { background, hover, placeholder, primary, secondary } from '../../utils/palette';

// firabse
import { signOut } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

const DURATION = 150;

const ActionsBar = ({ size }) => {
    const [pressed, setPressed] = useState(false);
    const [pressedAdd, setPressedAdd] = useState(false);
    const [pressedLogout, setPressedLogout] = useState(false);
    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();

    const onAddNewRecipe = () => {
        bottomSheetRef.current?.close();
        setTimeout(() => {
            navigation.navigate('Insertion');
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
            >
                <Text style={styles.placeholder}>
                    חיפוש מבין {size} מתכונים...
                </Text>
            </TouchableOpacity>
            <View style={[styles.wrapper, styles.image]}>
                <Image
                    source={require('../../../assets/images/boy.png')}
                    style={{ height: 30, width: 30 }}
                    resizeMode='cover'
                />
            </View>
            <RBSheet
                ref={bottomSheetRef}
                animationType='fade'
                closeOnDragDown
                closeDuration={DURATION}
                openDuration={DURATION}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        height: 170,
                        backgroundColor: background
                    },
                    draggableIcon: {
                        backgroundColor: secondary
                    },
                    wrapper: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }
                }}
            >
                <View>
                    <View style={styles.email}>
                        <Text style={styles.text}>{authentication.currentUser.email}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 15 }}>
                        <View style={styles.seperator} />
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => onAddNewRecipe()}
                            onPressIn={() => setPressedAdd(true)}
                            onPressOut={() => setPressedAdd(false)}
                            style={[styles.BSButton, pressedAdd && styles.buttonHover]}
                            activeOpacity={1}
                        >
                            <MaterialIcons style={styles.icon} name="post-add" size={18} color="white" />
                            <Text style={styles.text}>הוספת מתכון</Text>
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
                            <MaterialIcons style={styles.icon} name="logout" size={18} color="white" />
                            <Text style={styles.text}>התנתקות</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet >
        </View >
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
    }
});