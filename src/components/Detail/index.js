import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const Detail = ({ value, type }) => {
    const renderIcon = () => {
        switch (type) {
            case 'time':
                return <AntDesign name="clockcircleo" size={20} color="#FFFFFF" />;
            case 'quantity':
                return <MaterialCommunityIcons name="circle-double" size={20} color="#FFFFFF" />;
            case 'category':
                return <FontAwesome name="cutlery" size={20} color="#FFFFFF" />;
            default:
                return null;
        }
    }

    return (
        <View style={styles.container}>
            <View>{renderIcon()}</View>
            <Text style={[styles.text, type === 'time' && styles.move]}>{value}</Text>
        </View>
    )
}

export default Detail;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        //fontFamily: 'AlefBold',
        fontSize: 18,
        color: 'white'
    },
    move: {
        transform: [{ translateY: 1 }]
    }
});