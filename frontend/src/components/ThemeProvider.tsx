import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Theme types
export type ThemeMode = "light" | "dark" | "auto";

export interface ThemeConfig {
  mode: ThemeMode;
  automotive: {
    primary: string;
    accent: string;
    surface: string;
  };
  glassmorphism: {
    enabled: boolean;
    intensity: "subtle" | "medium" | "strong";
  };
  animations: {
    enabled: boolean;
    duration: "fast" | "normal" | "slow";
  };
}

interface ThemeContextType {
  // Current theme state
  isDark: boolean;
  mode: ThemeMode;
  config: ThemeConfig;

  // Theme actions
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  updateConfig: (config: Partial<ThemeConfig>) => void;

  // System preferences
  systemPreference: "light" | "dark";
  isSystemMode: boolean;
}

// Default theme configuration
const defaultThemeConfig: ThemeConfig = {
  mode: "auto",
  automotive: {
    primary: process.env.VITE_THEME_PRIMARY || "#2563eb",
    accent: process.env.VITE_THEME_ACCENT || "#f59e0b",
    surface: process.env.VITE_THEME_SURFACE || "#f8fafc"
  },
  glassmorphism: {
    enabled: true,
    intensity: "medium",
  },
  animations: {
    enabled: true,
    duration: "normal",
  },
};

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = "auto",
  storageKey = process.env.VITE_THEME_STORAGE_KEY || "autmatrix-theme",
}) => {
  // System preference detection
  const [systemPreference, setSystemPreference] = useState<"light" | "dark">(
    () => {
      if (typeof window === "undefined") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    },
  );

  // Theme configuration state
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window === "undefined") return defaultThemeConfig;

    try {
      const stored = localStorage.getItem(`${storageKey}-config`);
      return stored
        ? { ...defaultThemeConfig, ...JSON.parse(stored) }
        : defaultThemeConfig;
    } catch {
      return defaultThemeConfig;
    }
  });

  // Current theme mode
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultMode;

    try {
      const stored = localStorage.getItem(storageKey);
      return (stored as ThemeMode) || defaultMode;
    } catch {
      return defaultMode;
    }
  });

  // Computed dark mode state
  const isDark =
    mode === "dark" || (mode === "auto" && systemPreference === "dark");
  const isSystemMode = mode === "auto";

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    // Apply dark/light mode
    if (isDark) {
      root.classList.add("dark");
      body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
    }

    // Apply automotive theme variables
    root.style.setProperty("--automotive-primary", config.automotive.primary);
    root.style.setProperty("--automotive-accent", config.automotive.accent);
    root.style.setProperty("--automotive-surface", config.automotive.surface);

    // Apply glassmorphism settings
    if (config.glassmorphism.enabled) {
      root.classList.add("glassmorphism-enabled");
      root.setAttribute("data-glass-intensity", config.glassmorphism.intensity);
    } else {
      root.classList.remove("glassmorphism-enabled");
    }

    // Apply animation settings
    if (config.animations.enabled) {
      root.classList.add("animations-enabled");
      root.setAttribute("data-animation-duration", config.animations.duration);
    } else {
      root.classList.remove("animations-enabled");
    }

    // Store theme preference
    try {
      localStorage.setItem(storageKey, mode);
      localStorage.setItem(`${storageKey}-config`, JSON.stringify(config));
    } catch {
      // Handle storage errors silently
    }
  }, [isDark, mode, config, storageKey]);

  // Theme actions
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleTheme = () => {
    if (mode === "auto") {
      setMode(systemPreference === "dark" ? "light" : "dark");
    } else {
      setMode(mode === "dark" ? "light" : "dark");
    }
  };

  const updateConfig = (newConfig: Partial<ThemeConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Context value
  const contextValue: ThemeContextType = {
    isDark,
    mode,
    config,
    setMode,
    toggleTheme,
    updateConfig,
    systemPreference,
    isSystemMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

// Theme utility hooks
export const useColorScheme = () => {
  const { isDark } = useTheme();
  return isDark ? "dark" : "light";
};

export const useAutomotiveColors = () => {
  const { config } = useTheme();
  return config.automotive;
};

export const useGlassmorphism = () => {
  const { config } = useTheme();
  return config.glassmorphism;
};

export const useAnimations = () => {
  const { config } = useTheme();
  return config.animations;
};

// Theme preference persistence utilities
export const getStoredTheme = (
  storageKey = process.env.VITE_THEME_STORAGE_KEY || "autmatrix-theme",
): ThemeMode | null => {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(storageKey) as ThemeMode;
  } catch {
    return null;
  }
};

export const clearStoredTheme = (storageKey = process.env.VITE_THEME_STORAGE_KEY || "autmatrix-theme"): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}-config`);
  } catch {
    // Handle errors silently
  }
};

// Theme detection utilities
export const getSystemThemePreference = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const supportsColorScheme = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme)").matches;
};

// CSS-in-JS utilities for theme-aware styling
export const themeAware = (lightValue: string, darkValue: string) => {
  return `light-dark(${lightValue}, ${darkValue})`;
};

export const glassmorphismCSS = (
  intensity: "subtle" | "medium" | "strong" = "medium",
) => {
  const intensityMap = {
    subtle: {
      background: "rgba(255, 255, 255, 0.08)",
      border: "rgba(255, 255, 255, 0.12)",
      backdrop: "blur(12px)",
    },
    medium: {
      background: "rgba(255, 255, 255, 0.12)",
      border: "rgba(255, 255, 255, 0.18)",
      backdrop: "blur(20px)",
    },
    strong: {
      background: "rgba(255, 255, 255, 0.20)",
      border: "rgba(255, 255, 255, 0.30)",
      backdrop: "blur(32px)",
    },
  };

  const config = intensityMap[intensity];

  return {
    background: config.background,
    backdropFilter: config.backdrop,
    WebkitBackdropFilter: config.backdrop,
    border: `1px solid ${config.border}`,
    borderRadius: "12px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  };
};

// Export theme types for consumption
export type { ThemeMode, ThemeConfig };

// Default export for convenience
export default ThemeProvider;
