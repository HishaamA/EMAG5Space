import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlobalStyles, { colors } from '../styles/GlobalStyles';
import { LANDING_SITES } from '../data/mockLandingSites';
import { getAIAnalysis } from '../api/MissionAI';

const LandingSiteScreen = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [analyzingSiteId, setAnalyzingSiteId] = useState(null);
  const [siteAnalyses, setSiteAnalyses] = useState({});

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
  };

  const handleAnalyzeSite = async (site) => {
    setAnalyzingSiteId(site.id);

    try {
      const result = await getAIAnalysis('landing_site_analysis', site);
      
      setSiteAnalyses(prev => ({
        ...prev,
        [site.id]: result.responseText
      }));
    } catch (error) {
      console.error('Landing Site Analysis Error:', error);
      Alert.alert(
        'Analysis Failed',
        `Error: ${error.message}\n\nPlease check your API key configuration.`
      );
    } finally {
      setAnalyzingSiteId(null);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'low': return colors.success;
      case 'medium': return '#ffd60a';
      case 'high': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const renderAsteroidMap = () => {
    return (
      <View style={styles.asteroidMapContainer}>
        <Text style={styles.asteroidTitle}>Asteroid 269 Justitia</Text>
        <Text style={styles.asteroidSubtitle}>Landing Site Selection Map</Text>
        
        {/* Asteroid Visual */}
        <View style={styles.asteroidVisual}>
          <Image
            source={{ uri: 'https://spaceinsider.tech/wp-content/uploads/2024/02/4955128.jpg' }}
            style={styles.asteroidImage}
            resizeMode="cover"
          />
          
          {/* Landing Site Markers */}
          {LANDING_SITES.map((site) => {
            const isSelected = selectedSite?.id === site.id;
            const hasAnalysis = siteAnalyses[site.id];
            
            return (
              <TouchableOpacity
                key={site.id}
                style={[
                  styles.siteMarker,
                  {
                    top: site.position.top,
                    left: site.position.left,
                    backgroundColor: site.color,
                  },
                  isSelected && styles.siteMarkerSelected
                ]}
                onPress={() => handleSiteSelect(site)}
              >
                <View style={styles.siteMarkerInner}>
                  <View style={styles.siteMarkerDot} />
                  <Text style={styles.siteMarkerLabel}>{site.shortName}</Text>
                </View>
                {hasAnalysis && (
                  <View style={styles.analyzedDot}>
                    <Ionicons name="checkmark" size={10} color={colors.text} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Difficulty Level:</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Easy</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ffd60a' }]} />
              <Text style={styles.legendText}>Moderate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ff9500' }]} />
              <Text style={styles.legendText}>Challenging</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.legendText}>Very Challenging</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderSiteDetails = (site) => {
    const hasAnalysis = siteAnalyses[site.id];
    const isAnalyzing = analyzingSiteId === site.id;

    return (
      <View style={styles.siteDetailsCard}>
        {/* Header */}
        <View style={styles.siteDetailsHeader}>
          <View style={styles.siteIconContainer}>
            <Ionicons name="location" size={40} color={colors.text} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.siteTitleRow}>
              <Text style={styles.siteName}>{site.name}</Text>
              {hasAnalysis && (
                <View style={styles.analyzedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={styles.analyzedText}>ANALYZED</Text>
                </View>
              )}
            </View>
            <Text style={styles.siteCoordinates}>{site.coordinates}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Terrain</Text>
            <Text style={styles.statValue}>{site.terrain}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Slope</Text>
            <Text style={[styles.statValue, { color: getDifficultyColor(site.slopeLevel) }]}>
              {site.slope}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Science Value</Text>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < site.interestLevel ? 'star' : 'star-outline'}
                  size={14}
                  color={colors.accent}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Difficulty Badge */}
        <View style={[styles.difficultyBadge, { backgroundColor: site.color + '30' }]}>
          <Text style={[styles.difficultyText, { color: site.color }]}>
            {site.difficulty} Landing
          </Text>
        </View>

        {/* Characteristics Grid */}
        <View style={styles.characteristicsGrid}>
          <View style={styles.charItem}>
            <Ionicons name="analytics-outline" size={16} color={colors.info} />
            <Text style={styles.charLabel}>Geology:</Text>
            <Text style={styles.charValue}>{site.characteristics.geology}</Text>
          </View>
          <View style={styles.charItem}>
            <Ionicons name="warning-outline" size={16} color={colors.warning} />
            <Text style={styles.charLabel}>Hazards:</Text>
            <Text style={styles.charValue}>{site.characteristics.hazards}</Text>
          </View>
          <View style={styles.charItem}>
            <Ionicons name="diamond-outline" size={16} color={colors.success} />
            <Text style={styles.charLabel}>Resources:</Text>
            <Text style={styles.charValue}>{site.characteristics.resources}</Text>
          </View>
          <View style={styles.charItem}>
            <Ionicons name="sunny-outline" size={16} color={colors.accent} />
            <Text style={styles.charLabel}>Solar Exposure:</Text>
            <Text style={styles.charValue}>{site.characteristics.solarExposure}</Text>
          </View>
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            isAnalyzing && styles.analyzeButtonDisabled
          ]}
          onPress={() => handleAnalyzeSite(site)}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.analyzeButtonText}>Analyzing Landing Site...</Text>
            </>
          ) : (
            <>
              <Ionicons name="calculator" size={18} color={colors.text} />
              <Text style={styles.analyzeButtonText}>
                {hasAnalysis ? 'Re-analyze Site' : 'Run AI Landing Analysis'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* AI Analysis Result */}
        {hasAnalysis && (
          <View style={styles.analysisResult}>
            <View style={styles.analysisHeader}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <Text style={styles.analysisTitle}>Mission Engineer Analysis</Text>
            </View>
            <Text style={styles.analysisText}>{siteAnalyses[site.id]}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="location" size={32} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Landing Site Analyzer</Text>
            <Text style={styles.headerSubtitle}>
              AI-powered risk/benefit analysis for Asteroid 269 Justitia landing mission
            </Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoBannerText}>
            Tap any landing site marker on the map to view details and run AI analysis
          </Text>
        </View>

        {/* Asteroid Map */}
        {renderAsteroidMap()}

        {/* Site Details */}
        {selectedSite ? (
          renderSiteDetails(selectedSite)
        ) : (
          <View style={styles.noSelectionCard}>
            <Ionicons name="hand-left-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.noSelectionText}>Select a landing site to begin analysis</Text>
          </View>
        )}

        {/* Comparison Table */}
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>Site Comparison Overview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.comparisonTable}>
              {/* Header Row */}
              <View style={styles.comparisonRow}>
                <Text style={[styles.comparisonCell, styles.comparisonHeaderCell]}>Site</Text>
                <Text style={[styles.comparisonCell, styles.comparisonHeaderCell]}>Slope</Text>
                <Text style={[styles.comparisonCell, styles.comparisonHeaderCell]}>Science</Text>
                <Text style={[styles.comparisonCell, styles.comparisonHeaderCell]}>Difficulty</Text>
              </View>
              {/* Data Rows */}
              {LANDING_SITES.map((site) => (
                <TouchableOpacity
                  key={site.id}
                  style={[
                    styles.comparisonRow,
                    selectedSite?.id === site.id && styles.comparisonRowSelected
                  ]}
                  onPress={() => handleSiteSelect(site)}
                >
                  <View style={styles.comparisonCellContent}>
                    <Ionicons name="location" size={16} color={colors.text} />
                    <Text style={styles.comparisonCellText}>{site.shortName}</Text>
                  </View>
                  <Text style={[styles.comparisonCell, { color: getDifficultyColor(site.slopeLevel) }]}>
                    {site.slope}
                  </Text>
                  <View style={[styles.comparisonCell, { flexDirection: 'row' }]}>
                    {[...Array(site.interestLevel)].map((_, i) => (
                      <Ionicons key={i} name="star" size={12} color={colors.accent} />
                    ))}
                  </View>
                  <Text style={[styles.comparisonCell, { color: site.color }]}>
                    {site.difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info + '20',
    padding: 12,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    gap: 8,
  },
  infoBannerText: {
    fontSize: 13,
    color: colors.info,
    flex: 1,
  },
  asteroidMapContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  asteroidTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  asteroidSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  asteroidVisual: {
    width: '100%',
    height: 300,
    backgroundColor: colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  asteroidImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  asteroidEmoji: {
    fontSize: 200,
  },
  siteMarker: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  siteMarkerSelected: {
    borderColor: colors.primary,
    borderWidth: 4,
    transform: [{ scale: 1.15 }],
  },
  siteMarkerInner: {
    alignItems: 'center',
  },
  siteMarkerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.text,
    marginBottom: 4,
  },
  siteMarkerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  siteMarkerText: {
    fontSize: 24,
  },
  analyzedDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
    color: colors.text,
  },
  siteDetailsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  siteDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  siteIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.background,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  siteIcon: {
    fontSize: 48,
    marginRight: 12,
  },
  siteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  siteName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
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
  siteCoordinates: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '700',
  },
  characteristicsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  charItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  charLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    minWidth: 100,
  },
  charValue: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  analyzeButtonDisabled: {
    backgroundColor: colors.cardBorder,
  },
  analyzeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  analysisResult: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  analysisTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  analysisText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  noSelectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 40,
    margin: 16,
    marginTop: 0,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  noSelectionText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  comparisonSection: {
    margin: 16,
    marginTop: 0,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  comparisonTable: {
    backgroundColor: colors.card,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  comparisonRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  comparisonRowSelected: {
    backgroundColor: colors.primary + '20',
  },
  comparisonCell: {
    padding: 12,
    fontSize: 13,
    color: colors.text,
    minWidth: 100,
  },
  comparisonCellContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 12,
    minWidth: 100,
  },
  comparisonCellText: {
    fontSize: 13,
    color: colors.text,
  },
  comparisonHeaderCell: {
    fontWeight: '700',
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
});

export default LandingSiteScreen;
