import React, { useState, useEffect } from 'react';
import { StatusBar, Text, useColorScheme, View } from 'react-native';
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

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
  // const isDarkMode = useColorScheme() === 'dark';

  // Splash/Onboarding state
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Settings
  const [isOffline, setIsOffline] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const resetApp = async () => {
    setHasLoaded(false);
    setHasSeenOnboarding(false);
    setTasks([]); 
    await AsyncStorage.removeItem('TASKS');
  };

  // Mockdata for MainScreen tasks
  const [tasks, setTasks] = useState<Task[]>([
    // {
    //   id: "1",
    //   title: "Complete React Native assignment",
    //   description: "Build a task manager app with offline support",
    //   dueDate: new Date(Date.now() + 86400000).toISOString(), // shows date
    //   completed: false,
    //   createdAt: ''
    // },
    // {
    //   id: "2",
    //   title: "Review pull requests",
    //   description: "Check and approve pending PRs",
    //   dueDate: undefined, // will show 'Not set'
    //   completed: false,
    //   createdAt: ''
    // },
    // {
    //   id: "3",
    //   title: "Team standup meeting",
    //   description: "Daily sync with the team",
    //   dueDate: new Date(Date.now() + 3600000).toISOString(),
    //   completed: true,
    //   createdAt: ''
    // },
    // {
    //   id: "4",
    //   title: "Buy groceries",
    //   description: "Milk, eggs, bread",
    //   dueDate: undefined,
    //   completed: false,
    //   createdAt: ''
    // },
  ]);

  // storage
  // Load tasks from AsyncStorage
  const loadTasksFromStorage = async () => {
    try {
      const saved = await AsyncStorage.getItem('TASKS');
      if (saved) {
        setTasks(JSON.parse(saved));
        console.log('🧠 Loaded tasks from storage');
      } else {
        console.log('✨ No stored tasks found, using mock data');
      }
    } catch (error) {
      console.log('Failed to load tasks:', error);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasksToStorage = async (tasks: Task[]) => {
    try {
      await AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
      console.log('💾 Tasks saved to AsyncStorage');
    } catch (error) {
      console.log('Failed to save tasks:', error);
    }
  };

  // Optional: dump storage for debugging
  const dumpStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // console.log('All keys in storage:', keys);

      const tasks = await AsyncStorage.getItem('TASKS');
      console.log('Stored TASKS:', tasks);
    } catch (error) {
      console.log('Failed to read storage:', error);
    }
  };

  // Load tasks once on mount
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasksToStorage(tasks);
    dumpStorage();
  }, [tasks]);

  // Connection
  // real network state
  useEffect(() => {
    console.log("Simulated offline is now:", isOffline);
  }, [isOffline]);

  const [networkIsConnected, setNetworkIsConnected] = useState(true); 
  useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          console.log("Connection type:", state.type);
          console.log("Is connected?", state.isConnected);
          // setIsOffline(!state.isConnected);
          setNetworkIsConnected(state.isConnected ?? true);
        });
    
        return () => unsubscribe(); // cleanup on unmount
      }, []);
  
  // effective offline: either simulated or real offline
  const effectiveOffline = !networkIsConnected || isOffline;

  useEffect(() => {
    console.log("Effective offline:", effectiveOffline);
  }, [effectiveOffline]);


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
        {(props) => <MainScreen {...props} tasks={tasks} setTasks={setTasks} isDarkMode={isDarkMode}/>}
      </Tab.Screen>
      <Tab.Screen name="Settings"  options={{ headerShown: false }}>
        {(props) => <SettingsScreen {...props} 
                      onReset={resetApp} 
                      isOffline={isOffline} 
                      setIsOffline={setIsOffline}
                      isDarkMode={isDarkMode}
                      setIsDarkMode={setIsDarkMode}
                      />}
      </Tab.Screen>
    </Tab.Navigator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {/* {isOffline && ( */}
        {effectiveOffline && (
          <View
            style={{
              position: 'absolute',     
              top: 0,                  
              left: 0,
              right: 0,
              zIndex: 100,              
              backgroundColor: '#f8a50c',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 35,
              paddingTop: 50,      
              }}
            >
            <Text style={{ color: '#fff', fontWeight: '600' }}>You’re offline</Text>
          </View>
        )}
        {/* )} */}
        <NavigationContainer>
          <Stack.Navigator
             screenOptions={{
              headerTitle: '',
              //  headerShown: false,
              headerStyle: {
                backgroundColor: isDarkMode ? '#000' : 'f2f2f2',  // match content background
              },
               headerShadowVisible: false,  // remove bottom shadow line 
            }}
          >
            {!hasLoaded ? (
              <Stack.Screen name="Splash" options={{ headerShown: false }}>
                {(props) => (
                  <SplashScreen
                    {...props}
                    onComplete={() => setHasLoaded(true)}
                  />
                )}
              </Stack.Screen>
            ) : !hasSeenOnboarding ? (
              <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
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
