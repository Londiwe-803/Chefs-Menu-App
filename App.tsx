import React from 'react';
import { StatusBar } from 'react-native';
import { StoreProvider } from './src/context/StoreContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/colors';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <AppNavigator />
    </StoreProvider>
  );
};

export default App;
