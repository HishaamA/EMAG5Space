import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlobalStyles, { colors } from '../styles/GlobalStyles';
import { getMockTelemetry, getDataLinkStatus, getActivityLog } from '../data/mockMissionData';
import { getAIAnalysis } from '../api/MissionAI';
import { CONFIG } from '../config/appConfig';
import TelemetryChart from '../components/TelemetryChart';
import MissionTracker from '../components/MissionTracker';

const DashboardScreen = ({ navigation }) => {
  const [telemetry, setTelemetry] = useState(null);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [dataLink, setDataLink] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [aiMode, setAiMode] = useState('status_update');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Generate new telemetry data periodically
  useEffect(() => {
    // Get initial telemetry
    const initialData = getMockTelemetry();
    setTelemetry(initialData);
    setTelemetryHistory([initialData]);
    setDataLink(getDataLinkStatus());
    setActivityLog(getActivityLog());

    // Set up interval for continuous updates
    const interval = setInterval(() => {
      const newTelemetry = getMockTelemetry();
      setTelemetry(newTelemetry);
      setDataLink(getDataLinkStatus());
      setActivityLog(getActivityLog());
      
      setTelemetryHistory((prev) => {
        const updated = [...prev, newTelemetry];
        // Keep only the last MAX_HISTORY_LENGTH packets
        return updated.slice(-CONFIG.MAX_HISTORY_LENGTH);
      });
    }, CONFIG.TELEMETRY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // Handle AI analysis
  const handleRunAnalysis = async () => {
    if (!telemetry) {
      Alert.alert('No Data', 'Waiting for telemetry data...');
      return;
    }

    setIsLoadingAI(true);
    setAiResponse(null);

    try {
      const result = await getAIAnalysis(aiMode, telemetry, telemetryHistory);
      setAiResponse(result);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      Alert.alert(
        'Analysis Failed',
        `Error: ${error.message}\n\nPlease check your API key configuration.`
      );
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Render telemetry value with appropriate styling
  const renderTelemetryRow = (label, value, isWarning = false) => (
    <View style={GlobalStyles.row}>
      <Text style={GlobalStyles.label}>{label}</Text>
      <Text style={[GlobalStyles.value, isWarning && { color: colors.warning }]}>
        {value}
      </Text>
    </View>
  );

  // Render AI response based on mode
  const renderAIResponse = () => {
    if (!aiResponse) return null;

    if (aiMode === 'status_update') {
      return (
        <View style={[GlobalStyles.card, { borderColor: colors.info }]}>
          <Text style={[GlobalStyles.label, { marginBottom: 8 }]}>Mission Status Update</Text>
          <Text style={GlobalStyles.bodyText}>{aiResponse.responseText}</Text>
        </View>
      );
    }

    if (aiMode === 'anomaly_detection') {
      const isAnomaly = aiResponse.is_anomaly;
      const priorityColor = 
        aiResponse.priority === 'High' ? colors.warning :
        aiResponse.priority === 'Medium' ? colors.accent :
        colors.success;

      return (
        <View style={[GlobalStyles.card, { borderColor: priorityColor }]}>
          <Text style={[GlobalStyles.label, { marginBottom: 8 }]}>Anomaly Detection</Text>
          <View style={GlobalStyles.row}>
            <Text style={GlobalStyles.bodyText}>Status:</Text>
            <Text style={[GlobalStyles.value, { color: isAnomaly ? colors.warning : colors.success }]}>
              {isAnomaly ? 'ANOMALY DETECTED' : 'NOMINAL'}
            </Text>
          </View>
          {isAnomaly && (
            <View style={GlobalStyles.row}>
              <Text style={GlobalStyles.bodyText}>Priority:</Text>
              <Text style={[GlobalStyles.value, { color: priorityColor }]}>
                {aiResponse.priority}
              </Text>
            </View>
          )}
          <Text style={[GlobalStyles.bodyText, { marginTop: 8 }]}>
            {aiResponse.reason}
          </Text>
        </View>
      );
    }

    if (aiMode === 'risk_assessment') {
      const riskColor = 
        aiResponse.risk_level === 'Critical' ? colors.warning :
        aiResponse.risk_level === 'High' ? colors.warning :
        aiResponse.risk_level === 'Medium' ? colors.accent :
        colors.success;

      return (
        <View>
          <View style={[GlobalStyles.card, { borderColor: riskColor }]}>
            <Text style={[GlobalStyles.label, { marginBottom: 8 }]}>Mission Risk Assessment</Text>
            <View style={GlobalStyles.row}>
              <Text style={GlobalStyles.bodyText}>Risk Level:</Text>
              <Text style={[GlobalStyles.value, { color: riskColor }]}>
                {aiResponse.risk_level}
              </Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <Text style={[GlobalStyles.bodyText, { marginBottom: 4 }]}>Primary Concern:</Text>
              <Text style={GlobalStyles.value}>
                {aiResponse.primary_concern}
              </Text>
            </View>
            {aiResponse.time_to_critical !== 'N/A' && (
              <View style={{ marginTop: 12 }}>
                <Text style={[GlobalStyles.bodyText, { marginBottom: 4 }]}>Time to Critical:</Text>
                <Text style={[GlobalStyles.value, { color: colors.warning }]}>
                  {aiResponse.time_to_critical}
                </Text>
              </View>
            )}
            <Text style={[GlobalStyles.bodyText, { marginTop: 12, fontWeight: '600', color: colors.info }]}>
              Recommendation:
            </Text>
            <Text style={[GlobalStyles.bodyText, { marginTop: 4 }]}>
              {aiResponse.recommendation}
            </Text>
          </View>

          {/* Telemetry Trend Analysis */}
          <View style={[GlobalStyles.card, { marginTop: 8, borderColor: colors.cardBorder }]}>
            <Text style={[GlobalStyles.label, { marginBottom: 8 }]}>
              Telemetry Trend Analysis ({telemetryHistory.length} packets)
            </Text>
            
            {/* Battery Trend */}
            <View style={{ marginBottom: 12 }}>
              <Text style={[GlobalStyles.bodyText, { fontSize: 13, fontWeight: '600', color: colors.textSecondary }]}>
                Battery Level:
              </Text>
              <Text style={[GlobalStyles.bodyText, { fontSize: 12, marginTop: 4 }]}>
                {telemetryHistory.map((t, i) => `${t.battery_percent}%`).join(' → ')}
              </Text>
              {telemetryHistory.length >= 2 && (
                <Text style={[GlobalStyles.bodyText, { fontSize: 11, marginTop: 2, color: colors.textSecondary }]}>
                  Change: {(telemetryHistory[telemetryHistory.length - 1].battery_percent - 
                           telemetryHistory[0].battery_percent).toFixed(2)}% 
                  over {telemetryHistory.length * (CONFIG.TELEMETRY_INTERVAL_MS / 1000)}s
                </Text>
              )}
            </View>

            {/* Temperature Trend */}
            <View style={{ marginBottom: 12 }}>
              <Text style={[GlobalStyles.bodyText, { fontSize: 13, fontWeight: '600', color: colors.textSecondary }]}>
                Temperature:
              </Text>
              <Text style={[GlobalStyles.bodyText, { fontSize: 12, marginTop: 4 }]}>
                {telemetryHistory.map((t, i) => `${t.system_temp_c}°C`).join(' → ')}
              </Text>
              {telemetryHistory.length >= 2 && (
                <Text style={[GlobalStyles.bodyText, { fontSize: 11, marginTop: 2, color: colors.textSecondary }]}>
                  Change: {(telemetryHistory[telemetryHistory.length - 1].system_temp_c - 
                           telemetryHistory[0].system_temp_c).toFixed(1)}°C
                </Text>
              )}
            </View>

            {/* Signal Strength Trend */}
            <View>
              <Text style={[GlobalStyles.bodyText, { fontSize: 13, fontWeight: '600', color: colors.textSecondary }]}>
                Signal Strength:
              </Text>
              <Text style={[GlobalStyles.bodyText, { fontSize: 12, marginTop: 4 }]}>
                {telemetryHistory.map((t, i) => t.signal_strength).join(' → ')}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
  };

  if (!telemetry) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[GlobalStyles.bodyText, { marginTop: 16 }]}>
          Initializing telemetry feed...
        </Text>
      </View>
    );
  }

  const isWarning = telemetry.status_flag === 'Warning';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={GlobalStyles.container}>
        <Text style={GlobalStyles.title}>EMA: Real-Time Dashboard</Text>

        {/* Mission Progress Tracker */}
        <MissionTracker distance_from_earth_km={telemetry.distance_from_earth_km} />

        {/* AI Analyst Hub */}
        <Text style={GlobalStyles.subtitle}>AI Mission Analyst</Text>

        {/* Science Data Button - Featured */}
        <TouchableOpacity
          style={styles.scienceDataButton}
          onPress={() => navigation.navigate('ScienceAnalysis')}
        >
          <View style={styles.scienceDataContent}>
            <Ionicons name="telescope" size={28} color={colors.accent} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.scienceDataTitle}>🔬 AI Science Analysis Available</Text>
              <Text style={styles.scienceDataSubtitle}>
                Analyze lander images and sensor data with AI
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.accent} />
          </View>
        </TouchableOpacity>

        {/* AI Mode Selector */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <TouchableOpacity
            style={[
              GlobalStyles.buttonSecondary,
              { flex: 1, minWidth: 100 },
              aiMode === 'status_update' && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setAiMode('status_update')}
          >
            <Text style={GlobalStyles.buttonText}>Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              GlobalStyles.buttonSecondary,
              { flex: 1, minWidth: 100 },
              aiMode === 'anomaly_detection' && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setAiMode('anomaly_detection')}
          >
            <Text style={GlobalStyles.buttonText}>Anomaly</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              GlobalStyles.buttonSecondary,
              { flex: 1, minWidth: 100 },
              aiMode === 'risk_assessment' && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setAiMode('risk_assessment')}
          >
            <Text style={GlobalStyles.buttonText}>Risk</Text>
          </TouchableOpacity>
        </View>

        {/* Run Analysis Button */}
        <TouchableOpacity
          style={[GlobalStyles.button, { marginBottom: 16 }]}
          onPress={handleRunAnalysis}
          disabled={isLoadingAI}
        >
          <Text style={GlobalStyles.buttonText}>
            {isLoadingAI ? 'Analyzing...' : 'Run AI Analysis'}
          </Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {isLoadingAI && (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[GlobalStyles.label, { marginTop: 8 }]}>
              Contacting ARIA...
            </Text>
          </View>
        )}

        {/* AI Response Display */}
        {renderAIResponse()}

        {/* Live Telemetry Display */}
        <Text style={GlobalStyles.subtitle}>Live Telemetry</Text>
        <View style={[GlobalStyles.card, isWarning && { borderColor: colors.warning }]}>
          <Text style={[GlobalStyles.subtitle, { marginTop: 0 }]}>Current Status</Text>
          
          {renderTelemetryRow('Status', telemetry.status_flag, isWarning)}
          {renderTelemetryRow('Speed', `${telemetry.speed_kph.toLocaleString()} km/h`)}
          {renderTelemetryRow('Distance from Earth', `${telemetry.distance_from_earth_km.toLocaleString()} km`)}
          {renderTelemetryRow(
            'System Temperature',
            `${telemetry.system_temp_c}°C`,
            telemetry.system_temp_c < 0 || telemetry.system_temp_c > 40
          )}
          {renderTelemetryRow(
            'Signal Strength',
            telemetry.signal_strength,
            telemetry.signal_strength === 'Weak'
          )}
          {renderTelemetryRow(
            'Battery',
            `${telemetry.battery_percent}%`,
            telemetry.battery_percent < 60
          )}
          
          <View style={[GlobalStyles.row, { marginTop: 8 }]}>
            <Text style={[GlobalStyles.label, { fontSize: 12 }]}>Last Update</Text>
            <Text style={[GlobalStyles.label, { fontSize: 12 }]}>
              {new Date(telemetry.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        </View>

        {/* Interactive Telemetry Chart */}
        <TelemetryChart telemetryHistory={telemetryHistory} />

        {/* Data Link Section */}
        {dataLink && (
          <View style={GlobalStyles.card}>
            <View style={styles.dataLinkHeader}>
              <Ionicons name="wifi" size={24} color={colors.info} />
              <Text style={[GlobalStyles.subtitle, { marginTop: 0, marginLeft: 8 }]}>
                Data Link Status
              </Text>
            </View>
            
            <View style={GlobalStyles.row}>
              <Text style={GlobalStyles.label}>Data Transmitted</Text>
              <Text style={GlobalStyles.value}>
                {dataLink.transmitted} MB / {dataLink.total} MB
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${dataLink.percentage}%` }
                ]} 
              />
            </View>
            
            <View style={GlobalStyles.row}>
              <Text style={GlobalStyles.label}>Transfer Rate</Text>
              <Text style={GlobalStyles.value}>{dataLink.rate.toFixed(1)} MB/s</Text>
            </View>
            
            <View style={GlobalStyles.row}>
              <Text style={GlobalStyles.label}>Progress</Text>
              <Text style={[GlobalStyles.value, { color: colors.success }]}>
                {dataLink.percentage}%
              </Text>
            </View>
          </View>
        )}

        {/* Activity Log Section */}
        <View style={GlobalStyles.card}>
          <View style={styles.activityLogHeader}>
            <Ionicons name="list-circle-outline" size={24} color={colors.accent} />
            <Text style={[GlobalStyles.subtitle, { marginTop: 0, marginLeft: 8 }]}>
              Live Activity Log
            </Text>
          </View>
          
          {activityLog.length === 0 ? (
            <Text style={[GlobalStyles.bodyText, { fontStyle: 'italic', color: colors.textSecondary }]}>
              Waiting for lander activities...
            </Text>
          ) : (
            <View style={styles.activityLogContainer}>
              {activityLog.map((entry, index) => (
                <View key={`${entry.timestamp}-${index}`} style={styles.activityLogEntry}>
                  <Text style={styles.activityTime}>{entry.time}:</Text>
                  <Text style={styles.activityMessage}>{entry.message}</Text>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={16} 
                    color={colors.success} 
                    style={{ marginLeft: 'auto' }}
                  />
                </View>
              ))}
            </View>
          )}
          
          <Text style={[GlobalStyles.label, { fontSize: 11, marginTop: 12, textAlign: 'center' }]}>
            Updates every {CONFIG.TELEMETRY_INTERVAL_MS * 3 / 1000}s • Showing last 10 activities
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dataLinkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.info,
    borderRadius: 4,
  },
  activityLogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityLogContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
  },
  activityLogEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  activityTime: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
    marginRight: 8,
    minWidth: 50,
  },
  activityMessage: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  scienceDataButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  scienceDataContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scienceDataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  scienceDataSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default DashboardScreen;
