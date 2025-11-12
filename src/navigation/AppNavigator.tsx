import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import ChefMenuScreen from '../screens/ChefMenuScreen';
import FilterScreen from '../screens/FilterScreen';
import DishDetailScreen from '../screens/DishDetailScreen';
import AddEditDishScreen from '../screens/AddEditDishScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChefMenu" component={ChefMenuScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="DishDetail" component={DishDetailScreen} />
        <Stack.Screen name="AddEdit" component={AddEditDishScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
