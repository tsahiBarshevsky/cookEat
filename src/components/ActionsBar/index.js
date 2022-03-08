import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { placeholder, primary, secondary } from '../../utils/palette';

const ActionsBar = ({ size }) => {
    const [pressed, setPressed] = useState(false);
    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                style={[styles.wrapper, pressed && styles.button]}
            >
                <Feather name="menu" size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1}>
                <Text style={styles.text}>
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
        </View>
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
        color: placeholder
    }
});