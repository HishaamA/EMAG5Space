import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlobalStyles, { colors } from '../styles/GlobalStyles';
import { MOCK_SURFACE_IMAGES, MOCK_SENSOR_DATA } from '../data/mockScienceData';
import { getAIAnalysis } from '../api/MissionAI';

const ScienceAnalysisScreen = () => {
  const [activeTab, setActiveTab] = useState('images'); // 'images' or 'sensors'
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});

  const handleAnalyze = async (item, isImage) => {
    setAnalyzingId(item.id);

    try {
      const analysisType = isImage ? 'image_analysis' : 'data_analysis';
      const result = await getAIAnalysis(analysisType, item);
      
      setAnalysisResults(prev => ({
        ...prev,
        [item.id]: result.responseText
      }));
    } catch (error) {
      console.error('Analysis Error:', error);
      Alert.alert(
        'Analysis Failed',
        `Error: ${error.message}\n\nPlease check your API key configuration.`
      );
    } finally {
      setAnalyzingId(null);
    }
  };

  const renderImageCard = (image) => {
    const hasAnalysis = analysisResults[image.id];
    const isAnalyzing = analyzingId === image.id;

    return (
      <View key={image.id} style={styles.dataCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.visualContainer}>
            <Text style={styles.visualEmoji}>{image.visual}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardId}>{image.id}</Text>
              {hasAnalysis && (
                <View style={styles.analyzedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={styles.analyzedText}>ANALYZED</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardLocation}>{image.location}</Text>
            <Text style={styles.cardCoords}>{image.coordinates}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.cardDescription}>{image.description}</Text>

        {/* Timestamp */}
        <Text style={styles.timestamp}>
          <Ionicons name="time-outline" size={12} /> {new Date(image.timestamp).toLocaleString()}
        </Text>

        {/* Analyze Button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            isAnalyzing && styles.analyzeButtonDisabled
          ]}
          onPress={() => handleAnalyze(image, true)}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.analyzeButtonText}>Analyzing...</Text>
            </>
          ) : (
            <>
              <Ionicons name="flask" size={18} color={colors.text} />
              <Text style={styles.analyzeButtonText}>
                {hasAnalysis ? 'Re-analyze with AI' : 'Run AI Analysis'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* AI Analysis Result */}
        {hasAnalysis && (
          <View style={styles.analysisResult}>
            <View style={styles.analysisHeader}>
              <Ionicons name="bulb" size={20} color={colors.accent} />
              <Text style={styles.analysisTitle}>AI Astrogeologist Analysis</Text>
            </View>
            <Text style={styles.analysisText}>{analysisResults[image.id]}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSensorCard = (sensor) => {
    const hasAnalysis = analysisResults[sensor.id];
    const isAnalyzing = analyzingId === sensor.id;

    return (
      <View key={sensor.id} style={styles.dataCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.visualContainer, { backgroundColor: colors.info + '30' }]}>
            <Ionicons 
              name={
                sensor.type === 'composition' ? 'analytics' :
                sensor.type === 'temperature' ? 'thermometer' :
                sensor.type === 'magnetic' ? 'magnet' :
                'water'
              } 
              size={32} 
              color={colors.info} 
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardId}>{sensor.id}</Text>
              {hasAnalysis && (
                <View style={styles.analyzedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={styles.analyzedText}>ANALYZED</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardLocation}>{sensor.sampleId}</Text>
            <Text style={styles.cardCoords}>{sensor.location}</Text>
          </View>
        </View>

        {/* Data Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {sensor.type.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        {/* Data Display */}
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>Measurements ({sensor.unit}):</Text>
          {Object.entries(sensor.data).map(([key, value]) => (
            <View key={key} style={styles.dataRow}>
              <Text style={styles.dataKey}>{key.replace('_', ' ')}:</Text>
              <Text style={styles.dataValue}>
                {typeof value === 'number' ? value.toFixed(1) : value}
              </Text>
            </View>
          ))}
        </View>

        {/* Timestamp */}
        <Text style={styles.timestamp}>
          <Ionicons name="time-outline" size={12} /> {new Date(sensor.timestamp).toLocaleString()}
        </Text>

        {/* Analyze Button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            isAnalyzing && styles.analyzeButtonDisabled
          ]}
          onPress={() => handleAnalyze(sensor, false)}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.analyzeButtonText}>Analyzing...</Text>
            </>
          ) : (
            <>
              <Ionicons name="flask" size={18} color={colors.text} />
              <Text style={styles.analyzeButtonText}>
                {hasAnalysis ? 'Re-analyze with AI' : 'Run AI Analysis'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* AI Analysis Result */}
        {hasAnalysis && (
          <View style={styles.analysisResult}>
            <View style={styles.analysisHeader}>
              <Ionicons name="bulb" size={20} color={colors.accent} />
              <Text style={styles.analysisTitle}>AI Science Analysis</Text>
            </View>
            <Text style={styles.analysisText}>{analysisResults[sensor.id]}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="telescope" size={32} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Science Data Analysis</Text>
          <Text style={styles.headerSubtitle}>
            AI-powered analysis of lander imagery and sensor data
          </Text>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'images' && styles.tabActive]}
          onPress={() => setActiveTab('images')}
        >
          <Ionicons 
            name="camera" 
            size={20} 
            color={activeTab === 'images' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'images' && styles.tabTextActive
          ]}>
            Surface Images ({MOCK_SURFACE_IMAGES.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'sensors' && styles.tabActive]}
          onPress={() => setActiveTab('sensors')}
        >
          <Ionicons 
            name="stats-chart" 
            size={20} 
            color={activeTab === 'sensors' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'sensors' && styles.tabTextActive
          ]}>
            Sensor Data ({MOCK_SENSOR_DATA.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'images' ? (
          <>
            {MOCK_SURFACE_IMAGES.map(image => renderImageCard(image))}
          </>
        ) : (
          <>
            {MOCK_SENSOR_DATA.map(sensor => renderSensorCard(sensor))}
          </>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  dataCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  visualContainer: {
    width: 70,
    height: 70,
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  visualEmoji: {
    fontSize: 40,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  analyzedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  analyzedText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.success,
  },
  cardLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  cardCoords: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.info + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.info,
  },
  dataContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dataKey: {
    fontSize: 13,
    color: colors.text,
  },
  dataValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  analyzeButtonDisabled: {
    backgroundColor: colors.cardBorder,
  },
  analyzeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  analysisResult: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  analysisText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
});

export default ScienceAnalysisScreen;
