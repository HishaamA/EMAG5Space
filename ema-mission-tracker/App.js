import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';

// Import screens
import DashboardScreen from './screens/DashboardScreen';
import ModelViewerScreen from './screens/ModelViewerScreen';
import TimelineScreen from './screens/TimelineScreen';

// Import styles
import { colors } from './styles/GlobalStyles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'pulse-sharp';
          } else if (route.name === '3D Model') {
            iconName = 'planet-outline';
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
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
      />
      <Tab.Screen 
        name="3D Model" 
        component={ModelViewerScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={({ navigation }) => ({
            headerTitle: 'Mission Control',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Timeline')}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="list-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Timeline" 
          component={TimelineScreen}
          options={{
            headerTitle: 'Mission Timeline',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
