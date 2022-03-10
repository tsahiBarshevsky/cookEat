import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';
import { background, primary } from '../../utils/palette';

const DirectionBox = ({ index, value, size }) => {
    const [height, setHeight] = useState(0);
    const [firstRender, setFirstRender] = useState(true);
    return (
        <View style={styles.container} onLayout={(event) => {
            if (firstRender) {
                setFirstRender(false);
                setHeight(event.nativeEvent.layout.height);
            }
        }}>
            <View style={styles.stepWrapper}>
                <View style={styles.circle} />
                {index !== (size - 1) &&
                    <Dash
                        dashColor='white'
                        style={{
                            width: 1,
                            height: height,
                            flexDirection: 'column'
                        }}
                    />
                }
            </View>
            <View style={styles.content}>
                <Text style={[styles.text, styles.step]}>שלב {index + 1}</Text>
                <Text style={styles.text}>{value}</Text>
            </View>
        </View>
    )
}

export default DirectionBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1
    },
    stepWrapper: {
        alignItems: 'center',
        height: '100%',
        marginRight: 15
    },
    circle: {
        width: 15,
        height: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
    },
    line: {
        backgroundColor: 'white',
        width: 1,
        borderColor: 'white',
        minHeight: '100%',
        // borderRadius: 1
        // borderStyle: 'dotted',
        // borderWidth: 3,
    },
    index: {
        fontSize: 20,
        color: 'white'
    },
    content: {
        flexDirection: 'column',
        flex: 1
    },
    text: {
        color: 'white',
        flexShrink: 1
    },
    step: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});