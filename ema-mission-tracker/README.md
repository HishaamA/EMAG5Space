# EMA Mission Control Dashboard

A React Native + Expo application for monitoring the EMA (Envisaged Mission to Asteroid) spacecraft mission to asteroid 21 Lutetia. Features real-time telemetry simulation, AI-powered analysis using Google's Gemini API, 3D model viewer, and mission timeline.

## Features

- **Live Dashboard**: Real-time telemetry with periodic anomaly injection (every ~30 seconds)
- **AI Analyst**: Three analysis modes powered by Gemini AI:
  - Status Updates: Mission communications
  - Anomaly Detection: Automated system health monitoring
  - Trajectory Prediction: Distance forecasting
- **3D Model Viewer**: Interactive spacecraft visualization
- **Mission Timeline**: Complete mission milestone overview

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

1. Create a Google AI API key at: https://makersuite.google.com/app/apikey
2. Open the `.env` file in the project root
3. Replace `YOUR_API_KEY_HERE` with your actual API key:

```
GOOGLE_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: Never commit the `.env` file to version control. It's already in `.gitignore`.

### 3. Run the App

```bash
npm start
```

Then:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (macOS only)
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your phone

## Configuration

Customize timing and behavior in `config/appConfig.js`:

- `TELEMETRY_INTERVAL_MS`: How often new telemetry is generated (default: 2000ms)
- `ANOMALY_FREQUENCY`: How often anomalies occur (default: every 15th packet)
- `MAX_HISTORY_LENGTH`: Number of historical packets to keep (default: 10)

## Project Structure

```
ema-mission-tracker/
├── api/
│   └── MissionAI.js          # Gemini API integration
├── config/
│   └── appConfig.js          # App configuration constants
├── data/
│   └── mockMissionData.js    # Telemetry generator & timeline
├── screens/
│   ├── DashboardScreen.js    # Main dashboard
│   ├── ModelViewerScreen.js  # 3D model viewer
│   └── TimelineScreen.js     # Mission timeline
├── styles/
│   └── GlobalStyles.js       # Dark theme styling
├── .env                      # API keys (DO NOT COMMIT)
├── App.js                    # Navigation setup
└── babel.config.js          # Babel config for env vars
```

## Architecture: The 5 Pillars

1. **Navigation Shell** (App.js): Bottom tab navigation
2. **Data Layer** (data/): Mock telemetry with anomaly injection
3. **Dashboard** (screens/DashboardScreen.js): Real-time monitoring
4. **AI Service** (api/MissionAI.js): Gemini API integration
5. **Viewers** (screens/): 3D model and timeline

## Technologies

- **React Native** + **Expo**: Cross-platform framework
- **React Navigation**: Bottom tab navigation
- **@react-three/fiber**: 3D rendering
- **Google Gemini AI**: AI analysis
- **react-native-dotenv**: Environment variable management

## License

MIT
