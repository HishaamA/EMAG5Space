import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

// Import screens
import DashboardScreen from './screens/DashboardScreen';
import ModelViewerScreen from './screens/ModelViewerScreen';
import TimelineScreen from './screens/TimelineScreen';
import SpaceEducationScreen from './screens/SpaceEducationScreen';
import ScienceAnalysisScreen from './screens/ScienceAnalysisScreen';
import LandingSiteScreen from './screens/LandingSiteScreen';
import AIChatScreen from './screens/AIChatScreen';

// Import styles
import { colors } from './styles/GlobalStyles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator({ navigation }) {
  return (
    <>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'pulse-sharp';
          } else if (route.name === '3D Model') {
            iconName = 'planet-outline';
          } else if (route.name === 'Landing') {
            iconName = 'location-sharp';
          } else if (route.name === 'Education') {
            iconName = 'school-outline';
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
        name="Landing" 
        component={LandingSiteScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
          ),
        }}
      />
              <Tab.Screen 
          name="Model" 
          component={ModelViewerScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cube" size={size} color={color} />
            ),
            title: '3D Model'
          }}
        />
      <Tab.Screen 
        name="Education" 
        component={SpaceEducationScreen}
      />
    </Tab.Navigator>
    
    {/* Floating Chat Button */}
    <View style={styles.floatingButtonContainer}>
      <TouchableOpacity
        style={styles.floatingChatButton}
        onPress={() => navigation.navigate('AIChat')}
      >
        <Ionicons name="sparkles" size={28} color={colors.text} />
      </TouchableOpacity>
    </View>
    </>
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
        <Stack.Screen 
          name="ScienceAnalysis" 
          component={ScienceAnalysisScreen}
          options={{
            headerTitle: 'Science Data Analysis',
          }}
        />
        <Stack.Screen 
          name="AIChat" 
          component={AIChatScreen}
          options={{
            headerTitle: 'ARIA Assistant',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 50,
    right: 24,
    pointerEvents: 'box-none',
  },
  floatingChatButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    opacity: 0.80,
  },
});
