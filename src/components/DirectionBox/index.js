import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { primary } from '../../utils/palette';

const DirectionBox = ({ index, value }) => {
    return (
        <View style={styles.container}>
            <View style={styles.indexWrapper}>
                <Text style={styles.index}>{index + 1}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.text}>{value}</Text>
            </View>
        </View>
    )
}

export default DirectionBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    indexWrapper: {
        alignItems: 'center',
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: primary,
        elevation: 1,
        marginRight: 15
    },
    index: {
        //fontFamily: 'Alef',
        fontSize: 20,
        color: 'white'
    },
    content: {
        flexDirection: 'column',
        flex: 1
    },
    text: {
        //fontFamily: 'Alef',
        fontSize: 18,
        color: 'white',
        flexShrink: 1
    }
});