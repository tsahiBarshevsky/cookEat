import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import { I18nManager } from "react-native";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import rootReducer from './src/redux/reducers';
import * as Updates from 'expo-updates';
import { AppNavigator } from './src/components';
import { AppProvider } from './src/utils/context';
import { toastConfig } from './src/utils/toastConfig';

I18nManager.forceRTL(true);
const store = createStore(rootReducer);

export default function App() {
  useKeepAwake();

  const reload = async () => {
    await Updates.reloadAsync()
  }

  useEffect(() => {
    if (!I18nManager.isRTL)
      reload();
  }, []);

  return (
    <Provider store={store}>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
      <Toast config={toastConfig} />
    </Provider>
  );
}
