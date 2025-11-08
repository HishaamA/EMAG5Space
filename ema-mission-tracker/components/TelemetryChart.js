import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import GlobalStyles, { colors } from '../styles/GlobalStyles';

const TelemetryChart = ({ telemetryHistory }) => {
  if (!telemetryHistory || telemetryHistory.length < 2) {
    return (
      <View style={[GlobalStyles.card]}>
        <Text style={[GlobalStyles.label, { marginBottom: 8 }]}>
          Live Telemetry Trends
        </Text>
        <Text style={[GlobalStyles.bodyText, { fontSize: 14, color: colors.textSecondary }]}>
          Collecting data... (need at least 2 packets)
        </Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width - 32; // Account for padding

  // Prepare data - Battery percentage over time
  const batteryData = telemetryHistory.map(packet => packet.battery_percent);
  const tempData = telemetryHistory.map(packet => packet.system_temp_c);
  
  // Create labels (T-9, T-8, ..., T-0)
  const labels = telemetryHistory.map((_, index) => 
    index % 3 === 0 ? `T-${telemetryHistory.length - index - 1}` : ''
  );

  // Stock chart style config
  const batteryChartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 69, 58, ${opacity})`, // Red/warning color
    labelColor: (opacity = 1) => `rgba(160, 160, 176, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '0', // Hide dots for cleaner look
    },
    propsForBackgroundLines: {
      strokeDasharray: '', 
      stroke: colors.cardBorder,
      strokeWidth: 0.5,
      strokeOpacity: 0.3,
    },
    fillShadowGradient: colors.warning,
    fillShadowGradientOpacity: 0.3,
  };

  const tempChartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(100, 210, 255, ${opacity})`, // Blue/info color
    labelColor: (opacity = 1) => `rgba(160, 160, 176, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '0',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.cardBorder,
      strokeWidth: 0.5,
      strokeOpacity: 0.3,
    },
    fillShadowGradient: colors.info,
    fillShadowGradientOpacity: 0.3,
  };

  return (
    <View style={[GlobalStyles.card, { backgroundColor: colors.card }]}>
      <Text style={[GlobalStyles.label, { marginBottom: 16 }]}>
        � Live Telemetry Analytics
      </Text>
      
      {/* Battery Chart */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={[GlobalStyles.bodyText, { fontSize: 14, fontWeight: '600' }]}>
            🔋 Battery Level
          </Text>
          <Text style={[GlobalStyles.value, { color: colors.warning, fontSize: 20 }]}>
            {batteryData[batteryData.length - 1]}%
          </Text>
        </View>
        
        <LineChart
          data={{
            labels: labels,
            datasets: [{
              data: batteryData,
            }],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={batteryChartConfig}
          bezier
          style={{
            borderRadius: 8,
          }}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withDots={false}
          withShadow={true}
          withScrollableDot={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          segments={4}
          transparent={false}
        />
      </View>

      {/* Temperature Chart */}
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={[GlobalStyles.bodyText, { fontSize: 14, fontWeight: '600' }]}>
            🌡️ System Temperature
          </Text>
          <Text style={[GlobalStyles.value, { color: colors.info, fontSize: 20 }]}>
            {tempData[tempData.length - 1]}°C
          </Text>
        </View>
        
        <LineChart
          data={{
            labels: labels,
            datasets: [{
              data: tempData,
            }],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={tempChartConfig}
          bezier
          style={{
            borderRadius: 8,
          }}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withDots={false}
          withShadow={true}
          withScrollableDot={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          segments={4}
          transparent={false}
        />
      </View>

      <Text style={[GlobalStyles.bodyText, { fontSize: 11, marginTop: 16, color: colors.textSecondary, textAlign: 'center' }]}>
        Real-time telemetry • Updates every 2s • Last {telemetryHistory.length} packets
      </Text>
    </View>
  );
};

export default TelemetryChart;
