import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, StatusBar, TextInput, View, Button } from 'react-native';
import { authentication } from '../../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSignIn = () => {
        signInWithEmailAndPassword(authentication, email, password)
            .then(() => navigation.replace('Splash'))
            .catch((error) => console.log(error.message));
    }

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user)
                navigation.replace('Splash');
        });
        return unsubscribe;
    }, []);

    return (
        <View style={styles.container}>
            <TextInput
                value={email}
                placeholder='Email'
                onChangeText={(text) => setEmail(text)}
                keyboardType='email-address'
            />
            <TextInput
                value={password}
                placeholder='Password'
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
            />
            <Button title='Sign in' onPress={() => onSignIn()} />
            <Button title='Go to registration' onPress={() => navigation.navigate('Registration')} />
        </View>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
});