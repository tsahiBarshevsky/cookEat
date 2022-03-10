import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ScreenHeader = ({ text }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                style={styles.button}
            >
                <Entypo name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.text}>
                {text.length > 30 ? `${text.slice(0, 30)}...` : text}
            </Text>
        </View>
    )
}

export default ScreenHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: 60
    },
    text: {
        color: 'white',
        fontSize: 17,
        flexShrink: 1
    },
    button: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    }
});