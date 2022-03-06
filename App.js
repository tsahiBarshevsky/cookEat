import 'react-native-gesture-handler';
import React from 'react';
import { I18nManager } from "react-native";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './src/redux/reducers';
import { AppNavigator } from './src/components';

I18nManager.forceRTL(true);
const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
