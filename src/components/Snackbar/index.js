import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { toast } from '../../utils/palette';

const Snackbar = ({ props }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.icon, styles[props.type]]}>
                {props.type === 'success' ?
                    < AntDesign name="check" size={24} color="white" />
                    :
                    <FontAwesome name="exclamation-triangle" size={18} color="white" />
                }
            </View>
            <View style={{ marginLeft: 10 }}>
                <Text style={[styles.text, styles.bold]}>{props.text1}</Text>
                <Text style={styles.text}>{props.text2}</Text>
            </View>
        </View>
    )
}

export default Snackbar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        width: 35,
        borderRadius: 10,
    },
    success: {
        backgroundColor: '#00cc99'
    },
    error: {
        backgroundColor: '#eb5757'
    },
    text: {
        color: 'white'
    },
    bold: {
        fontWeight: 'bold'
    }
});