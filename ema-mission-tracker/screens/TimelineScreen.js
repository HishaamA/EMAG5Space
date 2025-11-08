import React from 'react';
import { View, Text, FlatList } from 'react-native';
import GlobalStyles, { colors } from '../styles/GlobalStyles';
import { MISSION_TIMELINE_DATA } from '../data/mockMissionData';

const TimelineScreen = () => {
  const renderTimelineItem = ({ item, index }) => {
    const isFirst = index === 0;
    const isLast = index === MISSION_TIMELINE_DATA.length - 1;

    return (
      <View style={{ marginBottom: 16 }}>
        <View style={GlobalStyles.card}>
          {/* Timeline Connector */}
          {!isFirst && (
            <View
              style={{
                position: 'absolute',
                left: 16,
                top: -16,
                width: 2,
                height: 16,
                backgroundColor: colors.primary,
              }}
            />
          )}

          {/* Timeline Dot */}
          <View
            style={{
              position: 'absolute',
              left: 8,
              top: 16,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.primary,
              borderWidth: 2,
              borderColor: colors.background,
            }}
          />

          {/* Content */}
          <View style={{ marginLeft: 32 }}>
            <Text style={[GlobalStyles.label, { color: colors.primary }]}>
              {item.date}
            </Text>
            <Text style={[GlobalStyles.value, { fontSize: 18, marginTop: 4 }]}>
              {item.event}
            </Text>
            <Text style={[GlobalStyles.bodyText, { fontSize: 14, marginTop: 8, color: colors.textSecondary }]}>
              {item.description}
            </Text>
          </View>

          {/* Connector to next item */}
          {!isLast && (
            <View
              style={{
                position: 'absolute',
                left: 16,
                bottom: -16,
                width: 2,
                height: 16,
                backgroundColor: colors.primary,
              }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Mission Timeline</Text>
      <Text style={[GlobalStyles.bodyText, { marginBottom: 20 }]}>
        EMA Mission to Asteroid 269 Lutetia
      </Text>

      <FlatList
        data={MISSION_TIMELINE_DATA}
        renderItem={renderTimelineItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default TimelineScreen;
