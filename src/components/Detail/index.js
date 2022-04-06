import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const Detail = ({ value, type }) => {
    const renderIcon = () => {
        switch (type) {
            case 'time':
                return (
                    <AntDesign
                        style={styles.icon}
                        name="clockcircleo"
                        size={18}
                        color="#FFFFFF"
                    />
                );
            case 'quantity':
                return (
                    <MaterialCommunityIcons
                        style={styles.icon}
                        name="circle-double"
                        size={25}
                        color="#FFFFFF"
                    />
                );
            case 'category':
                return (
                    <FontAwesome
                        style={styles.icon}
                        name="cutlery"
                        size={18}
                        color="#FFFFFF"
                    />);
            default:
                return null;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>{renderIcon()}</View>
            <Text style={styles.text}>{value}</Text>
        </View>
    )
}

export default Detail;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 17,
        color: 'white'
    },
    iconWrapper: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2.5,
    }
});