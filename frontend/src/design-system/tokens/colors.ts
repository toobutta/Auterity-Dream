/**
 * Unified Color System for Error-IQ
 * Provides consistent color palette across all components and themes
 */

export const COLORS = {
  // Primary Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main primary color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },

  // Secondary Colors
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',  // Main secondary color
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e'
  },

  // Accent Colors
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main accent color
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },

  // Neutral Grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',  // Main neutral color
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main success color
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Main error color
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main warning color
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main info color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  }
} as const;

// Color utilities
export const getColor = (colorName: keyof typeof COLORS, shade: number = 500) => {
  return COLORS[colorName][shade as keyof typeof COLORS[keyof typeof COLORS]];
};

// Semantic color mapping
export const SEMANTIC_COLORS = {
  // Background colors
  background: {
    primary: COLORS.neutral[50],
    secondary: COLORS.neutral[100],
    tertiary: COLORS.neutral[200],
    dark: {
      primary: COLORS.neutral[900],
      secondary: COLORS.neutral[800],
      tertiary: COLORS.neutral[700]
    }
  },

  // Surface colors
  surface: {
    primary: COLORS.neutral[50],
    secondary: COLORS.neutral[100],
    tertiary: COLORS.neutral[200],
    elevated: COLORS.neutral[50],
    dark: {
      primary: COLORS.neutral[900],
      secondary: COLORS.neutral[800],
      tertiary: COLORS.neutral[700],
      elevated: COLORS.neutral[800]
    }
  },

  // Text colors
  text: {
    primary: COLORS.neutral[900],
    secondary: COLORS.neutral[600],
    tertiary: COLORS.neutral[500],
    inverse: COLORS.neutral[50],
    dark: {
      primary: COLORS.neutral[50],
      secondary: COLORS.neutral[300],
      tertiary: COLORS.neutral[400],
      inverse: COLORS.neutral[900]
    }
  },

  // Border colors
  border: {
    primary: COLORS.neutral[200],
    secondary: COLORS.neutral[300],
    tertiary: COLORS.neutral[400],
    focus: COLORS.primary[500],
    dark: {
      primary: COLORS.neutral[700],
      secondary: COLORS.neutral[600],
      tertiary: COLORS.neutral[500],
      focus: COLORS.primary[400]
    }
  }
} as const;

// Theme-specific color mappings
export const LIGHT_THEME_COLORS = {
  // Component colors
  button: {
    primary: COLORS.primary[500],
    secondary: COLORS.neutral[500],
    success: COLORS.success[500],
    error: COLORS.error[500],
    warning: COLORS.warning[500]
  },

  // Interactive states
  interactive: {
    hover: COLORS.primary[600],
    active: COLORS.primary[700],
    focus: COLORS.primary[400],
    disabled: COLORS.neutral[300]
  },

  // Status colors
  status: {
    success: COLORS.success[500],
    error: COLORS.error[500],
    warning: COLORS.warning[500],
    info: COLORS.info[500]
  }
} as const;

export const DARK_THEME_COLORS = {
  // Component colors
  button: {
    primary: COLORS.primary[400],
    secondary: COLORS.neutral[400],
    success: COLORS.success[400],
    error: COLORS.error[400],
    warning: COLORS.warning[400]
  },

  // Interactive states
  interactive: {
    hover: COLORS.primary[300],
    active: COLORS.primary[200],
    focus: COLORS.primary[500],
    disabled: COLORS.neutral[600]
  },

  // Status colors
  status: {
    success: COLORS.success[400],
    error: COLORS.error[400],
    warning: COLORS.warning[400],
    info: COLORS.info[400]
  }
} as const;

// Export types for TypeScript
export type ColorName = keyof typeof COLORS;
export type Shade = keyof typeof COLORS.primary;
export type SemanticColor = typeof SEMANTIC_COLORS;
export type LightThemeColors = typeof LIGHT_THEME_COLORS;
export type DarkThemeColors = typeof DARK_THEME_COLORS;
