import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

import Icon from 'react-native-vector-icons/Ionicons';

// define type for task
interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

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

  // Mockdata for MainScreen tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete React Native assignment",
      description: "Build a task manager app with offline support",
      dueDate: new Date(Date.now() + 86400000).toISOString(), // shows date
      completed: false,
      createdAt: ''
    },
    {
      id: "2",
      title: "Review pull requests",
      description: "Check and approve pending PRs",
      dueDate: undefined, // will show 'Not set'
      completed: false,
      createdAt: ''
    },
    {
      id: "3",
      title: "Team standup meeting",
      description: "Daily sync with the team",
      dueDate: new Date(Date.now() + 3600000).toISOString(), // shows date
      completed: true,
      createdAt: ''
    },
    {
      id: "4",
      title: "Buy groceries",
      description: "Milk, eggs, bread",
      dueDate: undefined, // will show 'Not set'
      completed: false,
      createdAt: ''
    },
  ]);



  // ✅ Move MainScreenTabNavigator inside App, so it can access tasks & setTasks
  // const MainScreenTabNavigator = () => (
  //   <Tab.Navigator screenOptions={{ headerShown: false }}>
  //     <Tab.Screen name="Tasks">
  //       {(props) => <MainScreen {...props} tasks={tasks} setTasks={setTasks} />}
  //     </Tab.Screen>
  //     <Tab.Screen name="Settings">
  //       {(props) => <SettingsScreen {...props} onReset={resetApp} />}
  //     </Tab.Screen>
  //   </Tab.Navigator>
  // );
  const MainScreenTabNavigator = () => (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#007AFF', // iOS blue
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: isDarkMode ? '#000' : '#fff' },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === 'Tasks') {
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
      <Tab.Screen name="Tasks">
        {(props) => <MainScreen {...props} tasks={tasks} setTasks={setTasks} />}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} onReset={resetApp} />}
      </Tab.Screen>
    </Tab.Navigator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator
             screenOptions={{
              headerTitle: '',
               headerShown: false,
              headerStyle: {
                backgroundColor: '#f2f2f2', // match content background
              },
               headerShadowVisible: false,  // remove bottom shadow line 
            }}
          >
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
              <Stack.Screen name="Main" component={MainScreenTabNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
