// Internationalization strings for the Asteroid Mission Tracker

export type Language = "en" | "ar";

export const i18n = {
  en: {
    // App Shell
    appTitle: "Asteroid Mission Tracker",
    tabs: {
      dashboard: "Dashboard",
      viewer3d: "3D View",
      telemetry: "Data",
      ai: "AI"
    },

    // Dashboard
    dashboard: {
      title: "Mission Dashboard",
      simulatedBadge: "Simulated Data",
      kpis: {
        distance: "Distance to Target",
        velocity: "Velocity",
        fuel: "Fuel Remaining",
        temperature: "Bus Temperature",
        commsStatus: "Comms Status",
        phase: "Mission Phase",
        battery: "Battery",
        latency: "Comms Latency"
      },
      miniCharts: {
        velocity: "Velocity (last 15 min)",
        temperature: "Temperature (last 15 min)",
        battery: "Battery (last 15 min)",
        latency: "Latency (last 15 min)"
      }
    },

    // 3D Viewer
    viewer3d: {
      title: "OSIRIS-REx 3D View",
      loading: "Loading 3D visualization...",
      error: "Failed to load 3D view",
      retry: "Retry",
      fullscreen: "Fullscreen",
      timeSinceLaunch: "Time Since Launch"
    },

    // Telemetry Explorer
    telemetry: {
      title: "Telemetry Explorer",
      filters: "Filters",
      timeRange: "Time Range",
      exportCsv: "Export CSV",
      noData: "No data available for selected range",
      ranges: {
        "15m": "Last 15 minutes",
        "1h": "Last hour",
        "6h": "Last 6 hours",
        "24h": "Last 24 hours"
      }
    },

    // AI Panel
    ai: {
      title: "AI Mission Analysis",
      prediction: "Next Event Prediction",
      summary: "Daily Mission Summary",
      runPrediction: "Run Prediction",
      generateSummary: "Generate Summary",
      loading: "Analyzing...",
      error: "Failed to generate analysis",
      noApiKey: "Gemini API key not configured. Please add it in Settings.",
      confidence: "Confidence",
      eta: "ETA",
      minutes: "minutes",
      event: "Event",
      rationale: "Rationale"
    },

    // Settings
    settings: {
      title: "Settings",
      apiKey: "Gemini API Key",
      apiKeyPlaceholder: "Enter your Gemini API key",
      refreshRate: "Refresh Rate",
      theme: "Theme",
      toneMode: "AI Tone",
      toneTech: "Technical",
      toneSimple: "Simple",
      themeDark: "Dark",
      themeLight: "Light",
      save: "Save Settings",
      reset: "Reset Telemetry",
      resetConfirm: "Are you sure you want to reset all telemetry data?"
    },

    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      retry: "Retry",
      cancel: "Cancel",
      confirm: "Confirm",
      close: "Close"
    }
  },

  ar: {
    // Arabic stubs - to be completed for full localization
    appTitle: "متتبع مهمة الكويكب",
    tabs: {
      dashboard: "لوحة القيادة",
      viewer3d: "عرض ثلاثي الأبعاد",
      telemetry: "البيانات",
      ai: "الذكاء الاصطناعي"
    },

    dashboard: {
      title: "لوحة القيادة",
      simulatedBadge: "بيانات محاكاة",
      kpis: {
        distance: "المسافة إلى الهدف",
        velocity: "السرعة",
        fuel: "الوقود المتبقي",
        temperature: "درجة الحرارة",
        commsStatus: "حالة الاتصالات",
        phase: "مرحلة المهمة",
        battery: "البطارية",
        latency: "زمن الاستجابة"
      },
      miniCharts: {
        velocity: "السرعة (آخر 15 دقيقة)",
        temperature: "درجة الحرارة (آخر 15 دقيقة)",
        battery: "البطارية (آخر 15 دقيقة)",
        latency: "زمن الاستجابة (آخر 15 دقيقة)"
      }
    },

    viewer3d: {
      title: "عرض ثلاثي الأبعاد OSIRIS-REx",
      loading: "جاري التحميل...",
      error: "فشل تحميل العرض",
      retry: "إعادة المحاولة",
      fullscreen: "ملء الشاشة",
      timeSinceLaunch: "الوقت منذ الإطلاق"
    },

    telemetry: {
      title: "مستكشف القياس عن بعد",
      filters: "المرشحات",
      timeRange: "النطاق الزمني",
      exportCsv: "تصدير CSV",
      noData: "لا توجد بيانات متاحة",
      ranges: {
        "15m": "آخر 15 دقيقة",
        "1h": "آخر ساعة",
        "6h": "آخر 6 ساعات",
        "24h": "آخر 24 ساعة"
      }
    },

    ai: {
      title: "تحليل المهمة بالذكاء الاصطناعي",
      prediction: "توقع الحدث التالي",
      summary: "ملخص المهمة اليومي",
      runPrediction: "تشغيل التوقع",
      generateSummary: "إنشاء الملخص",
      loading: "جاري التحليل...",
      error: "فشل إنشاء التحليل",
      noApiKey: "مفتاح API غير مهيأ",
      confidence: "الثقة",
      eta: "الوقت المتوقع",
      minutes: "دقائق",
      event: "الحدث",
      rationale: "المنطق"
    },

    settings: {
      title: "الإعدادات",
      apiKey: "مفتاح Gemini API",
      apiKeyPlaceholder: "أدخل مفتاح API الخاص بك",
      refreshRate: "معدل التحديث",
      theme: "المظهر",
      toneMode: "نبرة الذكاء الاصطناعي",
      toneTech: "تقني",
      toneSimple: "بسيط",
      themeDark: "داكن",
      themeLight: "فاتح",
      save: "حفظ الإعدادات",
      reset: "إعادة تعيين البيانات",
      resetConfirm: "هل أنت متأكد من إعادة تعيين جميع البيانات؟"
    },

    common: {
      loading: "جاري التحميل...",
      error: "خطأ",
      retry: "إعادة المحاولة",
      cancel: "إلغاء",
      confirm: "تأكيد",
      close: "إغلاق"
    }
  }
};

// Helper function to get translations
export function getTranslations(lang: Language = "en") {
  return i18n[lang];
}
