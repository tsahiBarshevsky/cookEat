import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { secondary, toast } from '../../utils/palette';

const RecipeToast = ({ props }) => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: props.image }}
                resizeMode='cover'
                style={styles.image}
            />
            <Text style={styles.text}>{props.message}</Text>
        </View>
    )
}

export default RecipeToast;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        height: 45,
        backgroundColor: toast,
        paddingHorizontal: 5,
        borderRadius: 10,
        elevation: 2,
        borderColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1
    },
    image: {
        height: 35,
        width: 35,
        borderRadius: 10
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        flexShrink: 1,
        marginRight: 5
    }
});