import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { background } from '../../utils/palette';

// App screens
import {
    EditingScreen,
    FavoritesScreen,
    HomeScreen,
    ImagePreview,
    InsertionScreen,
    LoginScreen,
    ProfileScreen,
    RecipeScreen,
    RegistrationScreen,
    ResetPasswordScreen,
    SearchScreen,
    SplashScreen
} from '../../screens';

const Stack = createSharedElementStackNavigator();
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: background
    }
}

const AppNavigator = () => {
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen
                    name='Registration'
                    component={RegistrationScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='ResetPassword'
                    component={ResetPasswordScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Splash'
                    component={SplashScreen}
                    options={{
                        headerShown: false,
                        animationEnabled: false
                    }}
                />
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                        animationEnabled: false
                    }}
                />
                <Stack.Screen
                    name='Profile'
                    component={ProfileScreen}
                    options={{
                        headerShown: false,
                        presentation: 'transparentModal'
                    }}
                />
                <Stack.Screen
                    name='Recipe'
                    component={RecipeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Search'
                    component={SearchScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Favorites'
                    component={FavoritesScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Insertion'
                    component={InsertionScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='ImagePreview'
                    component={ImagePreview}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Editing'
                    component={EditingScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;