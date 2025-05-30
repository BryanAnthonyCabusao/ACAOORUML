// Polyfills for Supabase and Node modules
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { decode, encode } from 'base-64';
import { Buffer } from 'buffer';
import { Stream } from 'stream-browserify';

if (typeof global.btoa === 'undefined') global.btoa = encode;
if (typeof global.atob === 'undefined') global.atob = decode;
if (typeof global.Buffer === 'undefined') global.Buffer = Buffer;
if (typeof global.Stream === 'undefined') global.Stream = Stream;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// ✅ Use default imports, NOT named imports
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import CompareScreen from './screens/CompareScreen';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { session } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ animation: 'fade' }}>
      {session ? (
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Compare"
            component={CompareScreen}
            options={{
              title: 'Compare Algorithms',
              headerStyle: { backgroundColor: '#3366FF' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="light" backgroundColor="#3366FF" />
      </NavigationContainer>
    </AuthProvider>
  );
}
