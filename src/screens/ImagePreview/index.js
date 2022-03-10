import React from 'react';
import { StyleSheet, StatusBar, Image, View, TouchableOpacity } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { background } from '../../utils/palette';

const ImagePreview = ({ navigation, route }) => {
    const { image, origin } = route.params;

    return (
        <View style={styles.container}>
            <Animatable.View
                animation='zoomIn'
                delay={250}
                style={styles.floatingButton}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
            </Animatable.View>
            <SharedElement style={styles.image} id={`image-preview.${origin}`}>
                <Image
                    source={{ uri: image }}
                    resizeMode='cover'
                    style={styles.image}
                />
            </SharedElement>
        </View>
    )
}

ImagePreview.sharedElements = (route) => {
    const { origin } = route.params;
    return [
        {
            id: `image-preview.${origin}`,
            animation: 'move',
            resize: 'clip'
        }
    ];
}

export default ImagePreview;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: background,
        padding: 10
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 15
    },
    floatingButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: StatusBar.currentHeight + 5,
        width: 35,
        height: 35,
        borderRadius: 13,
        right: 5
    }
});