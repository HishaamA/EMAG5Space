import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import screens
import DashboardScreen from './screens/DashboardScreen';
import ModelViewerScreen from './screens/ModelViewerScreen';
import TimelineScreen from './screens/TimelineScreen';

// Import styles
import { colors } from './styles/GlobalStyles';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = 'pulse-sharp';
            } else if (route.name === '3D Model') {
              iconName = 'planet-outline';
            } else if (route.name === 'Timeline') {
              iconName = 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.cardBorder,
            borderTopWidth: 1,
          },
          headerStyle: {
            backgroundColor: colors.card,
            borderBottomColor: colors.cardBorder,
            borderBottomWidth: 1,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            headerTitle: 'Mission Control',
          }}
        />
        <Tab.Screen 
          name="3D Model" 
          component={ModelViewerScreen}
          options={{
            headerTitle: 'Spacecraft Model',
          }}
        />
        <Tab.Screen 
          name="Timeline" 
          component={TimelineScreen}
          options={{
            headerTitle: 'Mission Timeline',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
