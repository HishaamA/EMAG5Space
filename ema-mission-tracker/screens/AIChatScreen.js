import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlobalStyles, { colors } from '../styles/GlobalStyles';
import { getAIAnalysis } from '../api/MissionAI';

const AIChatScreen = ({ route }) => {
  const { currentTelemetry } = route.params || {};
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hello! I'm ARIA, your AI mission assistant for the Justitia Landing Mission. I can help answer questions about the mission, telemetry data, landing sites, or general space exploration topics. What would you like to know?",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);

  const suggestedQuestions = [
    "What is Asteroid 269 Justitia?",
    "How is our spacecraft doing?",
    "Which landing site should we choose?",
    "What can we mine from this asteroid?",
    "Explain the mission timeline",
  ];

  useEffect(() => {
    // Auto-scroll to bottom when new messages appear
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call AI with user message and context
      const result = await getAIAnalysis(
        'mission_chat',
        { 
          userMessage: userMessage.content,
          ...currentTelemetry 
        },
        conversationHistory
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.responseText,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please check your API configuration and try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputText(question);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Chat cleared! What would you like to know about the mission?",
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  const renderMessage = (message) => {
    const isUser = message.role === 'user';
    const isError = message.isError;

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer
        ]}
      >
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble,
          isError && styles.errorBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser && styles.userMessageText
          ]}>
            {message.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isUser && styles.userMessageTime
          ]}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {isUser && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={20} color={colors.text} />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatarContainer}>
            <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>ARIA</Text>
            <Text style={styles.headerSubtitle}>Mission Assistant</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingContainer}>
            <View style={styles.aiAvatar}>
              <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
            </View>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>ARIA is thinking</Text>
              <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />
            </View>
          </View>
        )}

        {/* Suggested Questions (show only at start) */}
        {messages.length === 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Try asking:</Text>
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestedQuestion(question)}
              >
                <Ionicons name="bulb-outline" size={14} color={colors.accent} />
                <Text style={styles.suggestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask ARIA anything..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isTyping) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() && !isTyping ? colors.text : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  clearButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  errorBubble: {
    backgroundColor: colors.warning + '20',
    borderColor: colors.warning,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  userMessageTime: {
    color: colors.text + 'CC',
    textAlign: 'right',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  typingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
    gap: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: colors.text,
  },
  inputContainer: {
    padding: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.cardBorder,
  },
});

export default AIChatScreen;
