import 'react-native-gesture-handler';
import React from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import { I18nManager } from "react-native";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import rootReducer from './src/redux/reducers';
import { useFonts } from 'expo-font';
import { AppNavigator } from './src/components';
import { AppProvider } from './src/utils/context';
import { toastConfig } from './src/utils/toastConfig';

I18nManager.forceRTL(true);
const store = createStore(rootReducer);

export default function App() {
  useKeepAwake();
  const [loaded] = useFonts({
    BilboSwashCaps: require('./assets/fonts/BilboSwashCaps-Regular.ttf'),
  });

  if (!loaded)
    return null;

  return (
    <Provider store={store}>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
      <Toast config={toastConfig} />
    </Provider>
  );
}
