/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import MainScreen from './src/screens/MainScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Splash/Onboarding state
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Settings
  const resetApp = () => {
    setHasLoaded(false);
    setHasSeenOnboarding(false);
  };

  return (
     <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator>
              {!hasLoaded ? (
              <Stack.Screen name="Splash">
                {(props) => (
                  <SplashScreen
                    {...props}
                    onComplete={() => setHasLoaded(true)}
                  />
                )}
              </Stack.Screen>
            ) : !hasSeenOnboarding ? (
              <Stack.Screen name="Onboarding">
                {(props) => (
                  <OnboardingScreen
                    {...props}
                    onComplete={() => setHasSeenOnboarding(true)}
                  />
                )}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="Main">
                {(props) => <MainScreenTabNavigator {...props} onReset={resetApp} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
     </GestureHandlerRootView>
  );
}

// Bottom Tabs for Tasks (CRUD) + Settings (dark/light mode, reset)
function MainScreenTabNavigator({ onReset }: { onReset: () => void }) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Tasks" component={MainScreen} />
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} onReset={onReset} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default App;
