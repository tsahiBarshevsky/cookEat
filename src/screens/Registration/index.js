import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, StatusBar, TextInput, View, Button } from 'react-native';
import { authentication } from '../../utils/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const RegistrationScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const onRegister = () => {
        createUserWithEmailAndPassword(authentication, email, password)
            .then((user) => {
                updateProfile(authentication.currentUser, { displayName: username });
                console.log(user);
            })
            .catch((error) => console.log(error.message));
    }

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user)
                navigation.replace('Home');
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
                // secureTextEntry
                onChangeText={(text) => setPassword(text)}
            />
            <TextInput
                value={username}
                placeholder='Username'
                onChangeText={(text) => setUsername(text)}
            />
            <Button title='Create user' onPress={() => onRegister()} />
            <Button title='Sign In' onPress={() => navigation.goBack()} />
        </View>
    )
}

export default RegistrationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
});