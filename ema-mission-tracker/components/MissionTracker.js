import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/GlobalStyles';

const MissionTracker = ({ distance_from_earth_km }) => {
  // Mission parameters
  const TOTAL_DISTANCE = 550000000; // ~550M km total journey to asteroid belt
  const EARTH_DISTANCE = 0;
  const MARS_DISTANCE = 225000000; // ~225M km (Mars flyby)
  const ASTEROID_DISTANCE = TOTAL_DISTANCE;

  // Calculate progress (0 to 1)
  const progress = Math.min(distance_from_earth_km / TOTAL_DISTANCE, 1);
  
  // Animation for spacecraft pulsing
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Calculate if spacecraft passed Mars
  const passedMars = distance_from_earth_km > MARS_DISTANCE;
  const isNearAsteroid = progress > 0.85;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mission Progress</Text>
      <Text style={styles.subtitle}>Journey to Asteroid 269 Justitia</Text>

      {/* Visual Tracker */}
      <View style={styles.trackerContainer}>
        {/* Background trajectory line */}
        <View style={styles.trajectoryLine} />
        
        {/* Dashed orbit path */}
        <View style={styles.dashedPath} />

        {/* Earth */}
        <View style={[styles.celestialBody, styles.earthPosition]}>
          <View style={styles.earth}>
            <Ionicons name="globe" size={24} color="#4A90E2" />
          </View>
          <Text style={styles.bodyLabel}>Earth</Text>
        </View>

        {/* Mars */}
        <View style={[styles.celestialBody, styles.marsPosition]}>
          <View style={[styles.mars, passedMars && styles.passedBody]}>
            <Ionicons name="planet" size={20} color="#E27B58" />
          </View>
          <Text style={[styles.bodyLabel, passedMars && styles.passedLabel]}>Mars</Text>
        </View>

        {/* Asteroid Belt / Target */}
        <View style={[styles.celestialBody, styles.asteroidPosition]}>
          <View style={[styles.asteroidBelt, isNearAsteroid && styles.activeDestination]}>
            <Ionicons name="ellipse" size={28} color={isNearAsteroid ? colors.primary : colors.textSecondary} />
          </View>
          <Text style={[styles.bodyLabel, isNearAsteroid && styles.activeLabel]}>269 Justitia</Text>
        </View>

        {/* Spacecraft */}
        <Animated.View 
          style={[
            styles.spacecraft,
            {
              left: `${progress * 85}%`,
              transform: [{ scale: pulseAnim }],
            }
          ]}
        >
          <Ionicons name="rocket" size={20} color={colors.accent} />
        </Animated.View>
      </View>

      {/* Progress Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Distance Traveled</Text>
          <Text style={styles.statValue}>{(distance_from_earth_km / 1000000).toFixed(1)}M km</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Mission Progress</Text>
          <Text style={styles.statValue}>{(progress * 100).toFixed(1)}%</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Remaining</Text>
          <Text style={styles.statValue}>{((TOTAL_DISTANCE - distance_from_earth_km) / 1000000).toFixed(1)}M km</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Mission Phases */}
      <View style={styles.phasesContainer}>
        <View style={styles.phase}>
          <View style={[styles.phaseIndicator, progress > 0 && styles.phaseComplete]} />
          <Text style={styles.phaseText}>Launch</Text>
        </View>
        <View style={styles.phaseLine} />
        <View style={styles.phase}>
          <View style={[styles.phaseIndicator, passedMars && styles.phaseComplete]} />
          <Text style={styles.phaseText}>Mars Flyby</Text>
        </View>
        <View style={styles.phaseLine} />
        <View style={styles.phase}>
          <View style={[styles.phaseIndicator, isNearAsteroid && styles.phaseComplete]} />
          <Text style={styles.phaseText}>Approach</Text>
        </View>
        <View style={styles.phaseLine} />
        <View style={styles.phase}>
          <View style={[styles.phaseIndicator, progress >= 1 && styles.phaseComplete]} />
          <Text style={styles.phaseText}>Arrival</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  trackerContainer: {
    height: 160,
    position: 'relative',
    marginBottom: 20,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
  },
  trajectoryLine: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: '50%',
    height: 2,
    backgroundColor: colors.cardBorder,
  },
  dashedPath: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: '50%',
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.primary + '60',
  },
  celestialBody: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earthPosition: {
    left: '5%',
    top: '35%',
  },
  marsPosition: {
    left: '45%',
    top: '25%',
  },
  asteroidPosition: {
    right: '5%',
    top: '30%',
  },
  earth: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  mars: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: '#E27B58',
    justifyContent: 'center',
    alignItems: 'center',
  },
  asteroidBelt: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDestination: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  passedBody: {
    opacity: 0.6,
  },
  bodyLabel: {
    fontSize: 11,
    color: colors.text,
    marginTop: 4,
    fontWeight: '600',
  },
  passedLabel: {
    color: colors.textSecondary,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  spacecraft: {
    position: 'absolute',
    top: '40%',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.cardBorder,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  phasesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phase: {
    alignItems: 'center',
  },
  phaseIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    marginBottom: 4,
  },
  phaseComplete: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  phaseText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  phaseLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 4,
  },
});

export default MissionTracker;
