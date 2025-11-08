# 🛸 Asteroid Mission Tracker

A mobile-first web application for tracking a fictional asteroid mission with real-time telemetry, 3D visualization, and AI-powered predictions.

## ✨ Features

- **📊 Mission Dashboard**: Real-time KPIs including distance, velocity, fuel, temperature, battery, and comms status
- **🌌 3D Visualization**: Embedded NASA Eyes OSIRIS-REx scene with mission overlay
- **📈 Telemetry Explorer**: Interactive charts and data table with time range filtering and CSV export
- **🤖 AI Analysis**: Gemini-powered predictions and daily summaries with adjustable tone
- **⚙️ Settings**: Configurable API key, refresh rate, theme, and AI tone preferences
- **📱 Mobile-First Design**: Optimized for mobile with large touch targets and smooth animations
- **🌙 Dark Theme**: Space-themed dark UI with high contrast and accessibility
- **🌐 Internationalization**: Built-in support for English and Arabic (stub)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HishaamA/g5space.git
cd g5space
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure Gemini API key:
```bash
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 Gemini API Setup

The app uses Google's Gemini API for AI predictions and summaries. You have two options:

### Option 1: Environment Variable (Recommended for production)
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy `.env.example` to `.env.local`
3. Add your key: `GEMINI_API_KEY=your_api_key_here`

### Option 2: In-App Settings (User-friendly)
1. Launch the app
2. Navigate to Settings tab (⚙️)
3. Enter your API key in the provided field
4. Click "Save Settings"

**Note**: Without an API key, the app will display mock AI responses.

## 📱 Mobile-First Design

The app is optimized for mobile devices with:
- Default breakpoint: ≤ 420px
- Large touch targets (44px+ minimum)
- Bottom navigation for thumb-friendly access
- Smooth transitions and animations (200ms)
- Lazy-loaded 3D iframe for performance
- Target: 60fps scrolling, <3s load on 4G

## 🧩 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand with persistence
- **Charts**: Recharts
- **3D Visualization**: NASA Eyes (iframe embed)
- **AI**: Google Gemini API
- **Date Utilities**: date-fns

## 📂 Project Structure

```
g5space/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── predict/route.ts    # AI prediction endpoint
│   │       └── summary/route.ts    # AI summary endpoint
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page (tab router)
├── components/
│   ├── AppShell.tsx                # App layout with navigation
│   ├── Dashboard.tsx               # Mission dashboard
│   ├── KpiGrid.tsx                 # Key performance indicators
│   ├── MiniCharts.tsx              # Live telemetry mini charts
│   ├── AiCard.tsx                  # AI prediction/summary card
│   ├── ThreeDView.tsx              # 3D viewer with NASA Eyes
│   ├── TelemetryExplorer.tsx       # Data explorer with charts
│   ├── AiPanel.tsx                 # AI analysis panel
│   └── Settings.tsx                # Settings configuration
├── lib/
│   ├── store.ts                    # Zustand state management
│   ├── telemetry.ts                # Telemetry generator & utilities
│   └── i18n.ts                     # Internationalization strings
├── types/
│   └── index.ts                    # TypeScript type definitions
└── public/                         # Static assets
```

## 🎮 Usage

### Navigation
- Use the bottom navigation bar to switch between tabs:
  - **📊 Dashboard**: Overview with KPIs and mini charts
  - **🌌 3D View**: Interactive 3D spacecraft visualization
  - **📈 Data**: Telemetry explorer with charts and export
  - **🤖 AI**: AI-powered predictions and summaries
  - **⚙️ Settings**: Configure preferences

### Telemetry Explorer
- Select time range: 15m, 1h, 6h, or 24h
- View interactive charts with hover details
- Export data as CSV for external analysis
- Browse data table (last 50 records shown)

### AI Features
1. **Predictions**: Click "Run Prediction" to analyze next mission event
2. **Summaries**: Click "Generate Summary" for daily mission overview
3. Toggle tone mode in Settings (Technical vs. Simple)

### Settings
- **API Key**: Enter Gemini API key for AI features
- **Refresh Rate**: Adjust telemetry generation interval (1-10s)
- **Theme**: Toggle dark/light mode (dark only for now)
- **Tone Mode**: Switch between technical and simple AI language
- **Reset Telemetry**: Clear all data and restart simulation

## 🔧 Telemetry Data

### Generated Variables
The app generates realistic dummy telemetry data:

| Variable | Range | Unit | Description |
|----------|-------|------|-------------|
| `distance_km` | 100 - 600,000 | km | Distance to target asteroid |
| `velocity_kms` | 0.1 - 35 | km/s | Spacecraft velocity |
| `fuel_pct` | 8 - 100 | % | Fuel remaining |
| `bus_temp_c` | -20 to +40 | °C | Bus temperature |
| `battery_pct` | 95 - 100 | % | Battery charge |
| `comms_latency_ms` | 100 - 800 | ms | Communication latency |
| `phase` | - | - | Mission phase |

### Mission Phases
1. **Launch**: Initial phase (fuel > 95%)
2. **Cruise**: Long-distance travel (distance > 300,000 km)
3. **Approach**: Closing in (distance > 50,000 km)
4. **Proximity Ops**: Near target (distance > 1,000 km)
5. **Surface Ops**: Final operations

### Data Persistence
- Last 24 hours of data stored in ring buffer (17,280 points @ 5s intervals)
- Settings persisted in localStorage
- Telemetry cleared on app restart or manual reset

## 🔮 Future Enhancements

Ready for real mission integration:

1. **Replace Dummy Data**: Swap `telemetry.ts` generator with live API feed
2. **Real-time WebSocket**: Add WebSocket support for live streaming
3. **Historical Data**: Connect to time-series database (e.g., InfluxDB)
4. **Authentication**: Add user accounts and mission-specific access
5. **Alerts**: Implement anomaly detection and notifications
6. **Offline Support**: Full PWA with ServiceWorker and IndexedDB caching
7. **Multi-language**: Complete Arabic translations and add more languages

## 📊 Performance Targets

- ✅ Mobile Lighthouse score ≥ 90
- ✅ 60fps scrolling and animations
- ✅ <3s first contentful paint on 4G
- ✅ Lazy-loaded 3D iframe
- ✅ Optimized bundle size

## 🌐 Accessibility

- High contrast color scheme (WCAG AA)
- Large touch targets (44px+ minimum)
- Semantic HTML with proper ARIA labels
- Keyboard navigation support
- Screen reader friendly

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- NASA Eyes for the OSIRIS-REx 3D visualization
- Google Gemini for AI capabilities
- OSIRIS-REx mission for inspiration

---

Built with ❤️ for space exploration enthusiasts
