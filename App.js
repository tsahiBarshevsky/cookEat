import 'react-native-gesture-handler';
import React from 'react';
import { I18nManager } from "react-native";
import { AppNavigator } from './src/components';

I18nManager.forceRTL(true);

export default function App() {
  return (
    <AppNavigator />
  );
}
