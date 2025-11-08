import { StyleSheet } from 'react-native';

// Dark space-themed color palette
export const colors = {
  background: '#0a0a1a',      // Dark navy background
  text: '#f0f0f0',            // Light text
  textSecondary: '#a0a0b0',   // Secondary text
  primary: '#007aff',         // iOS blue (primary actions)
  card: '#1c1c2e',            // Card/container background
  cardBorder: '#2a2a3e',      // Card border
  warning: '#ff453a',         // Red (warnings/errors)
  success: '#30d158',         // Green (success states)
  info: '#64d2ff',            // Light blue (info)
  accent: '#bf5af2',          // Purple (accents)
};

// Global stylesheet
const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  
  bodyText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  
  buttonSecondary: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
});

export default GlobalStyles;
