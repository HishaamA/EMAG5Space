import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlobalStyles, { colors } from '../styles/GlobalStyles';

const SpaceEducationScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizQuestions = [
    {
      question: 'What is the maximum speed that radio signals travel at?',
      options: [
        'Speed of sound',
        'Speed of light',
        'Speed of the spacecraft',
        'Faster than light'
      ],
      correctAnswer: 1,
      explanation: 'Radio signals are electromagnetic waves that travel at the speed of light (300,000 km/s).'
    },
    {
      question: 'What can water from asteroids be converted into?',
      options: [
        'Drinking water only',
        'Oxygen only',
        'Rocket fuel',
        'Metal ore'
      ],
      correctAnswer: 2,
      explanation: 'Water can be split into hydrogen and oxygen through electrolysis, creating rocket fuel for deep space missions.'
    },
    {
      question: 'What orbital maneuver is the most fuel-efficient for changing orbits?',
      options: [
        'Direct thrust',
        'Hohmann transfer',
        'Spiral transfer',
        'Gravitational slingshot'
      ],
      correctAnswer: 1,
      explanation: 'The Hohmann transfer is an elliptical orbit maneuver that uses the least amount of fuel to transfer between two circular orbits.'
    },
    {
      question: 'What is the typical temperature range spacecraft thermal systems must handle?',
      options: [
        '0°C to 100°C',
        '-50°C to +50°C',
        '-150°C to +150°C',
        '-273°C to 0°C'
      ],
      correctAnswer: 2,
      explanation: 'Spacecraft face extreme temperature variations in space, from -150°C in shadow to +150°C in direct sunlight.'
    },
    {
      question: 'How do spacecraft use gravitational slingshots?',
      options: [
        'To slow down without fuel',
        'To change direction only',
        'To gain speed without fuel',
        'To generate electricity'
      ],
      correctAnswer: 2,
      explanation: 'Gravitational slingshots use a planet\'s gravity to accelerate a spacecraft, allowing it to gain speed without using fuel.'
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const educationTopics = [
    {
      id: 1,
      icon: 'rocket-outline',
      title: 'Asteroid Mining',
      description: 'Learn about the future of resource extraction from asteroids and how missions like EMA pave the way.',
      facts: [
        'A single asteroid could contain trillions of dollars worth of precious metals',
        'Near-Earth asteroids are easier to reach than the Moon',
        'Water from asteroids can be converted into rocket fuel'
      ]
    },
    {
      id: 2,
      icon: 'planet-outline',
      title: 'Orbital Mechanics',
      description: 'Understand how spacecraft navigate through space using gravity and momentum.',
      facts: [
        'Spacecraft use gravitational slingshots to gain speed without fuel',
        'The Hohmann transfer is the most fuel-efficient way to change orbits',
        'Objects in orbit are constantly falling, but moving fast enough to miss the planet'
      ]
    },
    {
      id: 3,
      icon: 'flash-outline',
      title: 'Space Communication',
      description: 'Discover how we communicate with spacecraft millions of kilometers away.',
      facts: [
        'Radio signals travel at the speed of light (300,000 km/s)',
        'Deep space communication uses the Deep Space Network (DSN)',
        'Signal delay to Mars can be up to 22 minutes one-way'
      ]
    },
    {
      id: 4,
      icon: 'construct-outline',
      title: 'Spacecraft Systems',
      description: 'Explore the critical systems that keep spacecraft operational in harsh environments.',
      facts: [
        'Solar panels generate power from sunlight, even at great distances',
        'Thermal control systems maintain temperature between -150°C and +150°C',
        'Redundant systems ensure mission success even when components fail'
      ]
    },
  ];

  const externalResources = [
    {
      title: 'NASA Solar System Exploration',
      url: 'https://solarsystem.nasa.gov/',
      icon: 'globe-outline'
    },
    {
      title: 'ESA Kids - Space Education',
      url: 'https://www.esa.int/kids/en/home',
      icon: 'school-outline'
    },
    {
      title: 'The Planetary Society',
      url: 'https://www.planetary.org/',
      icon: 'earth-outline'
    }
  ];

  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <View style={GlobalStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="school-outline" size={40} color={colors.primary} />
          <Text style={styles.headerTitle}>Space Education</Text>
          <Text style={styles.headerSubtitle}>
            Learn about space exploration and asteroid missions
          </Text>
        </View>

        {/* Education Topics */}
        {educationTopics.map((topic) => (
          <View key={topic.id} style={styles.topicCard}>
            <View style={styles.topicHeader}>
              <Ionicons name={topic.icon} size={28} color={colors.primary} />
              <Text style={styles.topicTitle}>{topic.title}</Text>
            </View>
            <Text style={styles.topicDescription}>{topic.description}</Text>
            
            <View style={styles.factsContainer}>
              <Text style={styles.factsLabel}>Key Facts:</Text>
              {topic.facts.map((fact, index) => (
                <View key={index} style={styles.factRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* External Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.resourcesTitle}>Learn More</Text>
          {externalResources.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resourceCard}
              onPress={() => openURL(resource.url)}
            >
              <Ionicons name={resource.icon} size={24} color={colors.primary} />
              <Text style={styles.resourceText}>{resource.title}</Text>
              <Ionicons name="open-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quiz Section */}
        <View style={styles.quizSection}>
          <View style={styles.quizHeader}>
            <Ionicons name="help-circle-outline" size={32} color={colors.primary} />
            <Text style={styles.quizTitle}>Test Your Knowledge</Text>
          </View>

          {!quizCompleted ? (
            <View style={styles.quizCard}>
              {/* Progress */}
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }
                    ]} 
                  />
                </View>
              </View>

              {/* Question */}
              <Text style={styles.questionText}>
                {quizQuestions[currentQuestionIndex].question}
              </Text>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {quizQuestions[currentQuestionIndex].options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === quizQuestions[currentQuestionIndex].correctAnswer;
                  const showCorrect = showResult && isCorrect;
                  const showIncorrect = showResult && isSelected && !isCorrect;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        isSelected && !showResult && styles.optionSelected,
                        showCorrect && styles.optionCorrect,
                        showIncorrect && styles.optionIncorrect,
                      ]}
                      onPress={() => handleAnswerSelect(index)}
                      disabled={showResult}
                    >
                      <Text style={[
                        styles.optionText,
                        (isSelected || showCorrect || showIncorrect) && styles.optionTextSelected
                      ]}>
                        {option}
                      </Text>
                      {showCorrect && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                      )}
                      {showIncorrect && (
                        <Ionicons name="close-circle" size={20} color={colors.warning} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Explanation */}
              {showResult && (
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationLabel}>
                    {selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer 
                      ? '✅ Correct!' 
                      : '❌ Incorrect'}
                  </Text>
                  <Text style={styles.explanationText}>
                    {quizQuestions[currentQuestionIndex].explanation}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                {!showResult ? (
                  <TouchableOpacity
                    style={[styles.submitButton, selectedAnswer === null && styles.submitButtonDisabled]}
                    onPress={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                  >
                    <Text style={styles.submitButtonText}>Submit Answer</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNextQuestion}
                  >
                    <Text style={styles.nextButtonText}>
                      {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.text} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.resultsCard}>
              <Ionicons 
                name={score >= quizQuestions.length * 0.8 ? 'trophy' : score >= quizQuestions.length * 0.6 ? 'star' : 'ribbon'} 
                size={60} 
                color={score >= quizQuestions.length * 0.8 ? colors.success : score >= quizQuestions.length * 0.6 ? colors.primary : colors.warning} 
              />
              <Text style={styles.resultsTitle}>Quiz Complete!</Text>
              <Text style={styles.resultsScore}>
                Your Score: {score} / {quizQuestions.length}
              </Text>
              <Text style={styles.resultsPercentage}>
                {Math.round((score / quizQuestions.length) * 100)}%
              </Text>
              <Text style={styles.resultsMessage}>
                {score >= quizQuestions.length * 0.8 
                  ? '🌟 Excellent! You\'re a space expert!' 
                  : score >= quizQuestions.length * 0.6 
                  ? '👍 Good job! Keep learning!' 
                  : '📚 Keep studying! You\'ll get there!'}
              </Text>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={handleRestartQuiz}
              >
                <Ionicons name="refresh" size={20} color={colors.text} />
                <Text style={styles.restartButtonText}>Retake Quiz</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Mission Info */}
        <View style={styles.missionInfo}>
          <Text style={styles.missionTitle}>About the EMA Mission</Text>
          <Text style={styles.missionText}>
            The Envisaged Mission to Asteroid (EMA) represents humanity's next step in
            space exploration. This mission demonstrates advanced telemetry systems,
            AI-powered anomaly detection, and real-time risk assessment—technologies
            crucial for future deep space missions.
          </Text>
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
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  topicCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 10,
  },
  topicDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  factsContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  factsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  factText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  resourcesSection: {
    padding: 16,
    marginTop: 8,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  resourceText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  missionInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  missionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  quizSection: {
    padding: 16,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 10,
  },
  quizCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: `${colors.success}15`,
  },
  optionIncorrect: {
    borderColor: colors.warning,
    backgroundColor: `${colors.warning}15`,
  },
  optionText: {
    fontSize: 15,
    color: colors.textSecondary,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.text,
    fontWeight: '500',
  },
  explanationContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.cardBorder,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  nextButton: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  resultsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resultsPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 8,
  },
  resultsMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  restartButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
});

export default SpaceEducationScreen;
