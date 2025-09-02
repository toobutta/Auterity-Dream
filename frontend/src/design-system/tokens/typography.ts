/**
 * Unified Typography System for Error-IQ
 * Provides consistent typography scales and styles across all components
 */

export const TYPOGRAPHY = {
  // Font Families
  fonts: {
    primary: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Helvetica Neue',
      'sans-serif'
    ].join(', '),

    mono: [
      'JetBrains Mono',
      'SF Mono',
      'Monaco',
      'Inconsolata',
      'Fira Code',
      'Droid Sans Mono',
      'Source Code Pro',
      'monospace'
    ].join(', '),

    heading: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif'
    ].join(', ')
  },

  // Font Sizes (responsive scale)
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem'     // 128px
  },

  // Font Weights
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },

  // Line Heights
  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
} as const;

// Typography presets for consistent usage
export const TEXT_PRESETS = {
  // Display text (large headings)
  display: {
    '2xl': {
      fontSize: TYPOGRAPHY.sizes['7xl'],
      fontWeight: TYPOGRAPHY.weights.bold,
      lineHeight: TYPOGRAPHY.lineHeights.tight,
      letterSpacing: TYPOGRAPHY.letterSpacing.tighter
    },
    xl: {
      fontSize: TYPOGRAPHY.sizes['6xl'],
      fontWeight: TYPOGRAPHY.weights.bold,
      lineHeight: TYPOGRAPHY.lineHeights.tight,
      letterSpacing: TYPOGRAPHY.letterSpacing.tighter
    },
    lg: {
      fontSize: TYPOGRAPHY.sizes['5xl'],
      fontWeight: TYPOGRAPHY.weights.bold,
      lineHeight: TYPOGRAPHY.lineHeights.tight,
      letterSpacing: TYPOGRAPHY.letterSpacing.tighter
    }
  },

  // Headings
  heading: {
    h1: {
      fontSize: TYPOGRAPHY.sizes['4xl'],
      fontWeight: TYPOGRAPHY.weights.bold,
      lineHeight: TYPOGRAPHY.lineHeights.tight,
      letterSpacing: TYPOGRAPHY.letterSpacing.tight
    },
    h2: {
      fontSize: TYPOGRAPHY.sizes['3xl'],
      fontWeight: TYPOGRAPHY.weights.semibold,
      lineHeight: TYPOGRAPHY.lineHeights.tight,
      letterSpacing: TYPOGRAPHY.letterSpacing.tight
    },
    h3: {
      fontSize: TYPOGRAPHY.sizes['2xl'],
      fontWeight: TYPOGRAPHY.weights.semibold,
      lineHeight: TYPOGRAPHY.lineHeights.snug,
      letterSpacing: TYPOGRAPHY.letterSpacing.tight
    },
    h4: {
      fontSize: TYPOGRAPHY.sizes.xl,
      fontWeight: TYPOGRAPHY.weights.semibold,
      lineHeight: TYPOGRAPHY.lineHeights.snug,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    },
    h5: {
      fontSize: TYPOGRAPHY.sizes.lg,
      fontWeight: TYPOGRAPHY.weights.medium,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    },
    h6: {
      fontSize: TYPOGRAPHY.sizes.base,
      fontWeight: TYPOGRAPHY.weights.medium,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    }
  },

  // Body text
  body: {
    lg: {
      fontSize: TYPOGRAPHY.sizes.lg,
      fontWeight: TYPOGRAPHY.weights.normal,
      lineHeight: TYPOGRAPHY.lineHeights.relaxed,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    },
    base: {
      fontSize: TYPOGRAPHY.sizes.base,
      fontWeight: TYPOGRAPHY.weights.normal,
      lineHeight: TYPOGRAPHY.lineHeights.relaxed,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    },
    sm: {
      fontSize: TYPOGRAPHY.sizes.sm,
      fontWeight: TYPOGRAPHY.weights.normal,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    },
    xs: {
      fontSize: TYPOGRAPHY.sizes.xs,
      fontWeight: TYPOGRAPHY.weights.normal,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.wide
    }
  },

  // UI text (buttons, labels, etc.)
  ui: {
    lg: {
      fontSize: TYPOGRAPHY.sizes.lg,
      fontWeight: TYPOGRAPHY.weights.medium,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    },
    base: {
      fontSize: TYPOGRAPHY.sizes.base,
      fontWeight: TYPOGRAPHY.weights.medium,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    },
    sm: {
      fontSize: TYPOGRAPHY.sizes.sm,
      fontWeight: TYPOGRAPHY.weights.medium,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.wide
    },
    xs: {
      fontSize: TYPOGRAPHY.sizes.xs,
      fontWeight: TYPOGRAPHY.weights.medium,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.wider
    }
  },

  // Code text
  code: {
    inline: {
      fontFamily: TYPOGRAPHY.fonts.mono,
      fontSize: TYPOGRAPHY.sizes.sm,
      fontWeight: TYPOGRAPHY.weights.normal,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    },
    block: {
      fontFamily: TYPOGRAPHY.fonts.mono,
      fontSize: TYPOGRAPHY.sizes.sm,
      fontWeight: TYPOGRAPHY.weights.normal,
      lineHeight: TYPOGRAPHY.lineHeights.normal,
      letterSpacing: TYPOGRAPHY.letterSpacing.normal
    }
  }
} as const;

// Typography utilities
export const getTypographyClass = (preset: keyof typeof TEXT_PRESETS, variant: string) => {
  return `text-preset-${preset}-${variant}`;
};

// CSS custom properties for typography
export const TYPOGRAPHY_CSS_VARIABLES = {
  // Font families
  '--font-primary': TYPOGRAPHY.fonts.primary,
  '--font-mono': TYPOGRAPHY.fonts.mono,
  '--font-heading': TYPOGRAPHY.fonts.heading,

  // Font sizes
  '--text-xs': TYPOGRAPHY.sizes.xs,
  '--text-sm': TYPOGRAPHY.sizes.sm,
  '--text-base': TYPOGRAPHY.sizes.base,
  '--text-lg': TYPOGRAPHY.sizes.lg,
  '--text-xl': TYPOGRAPHY.sizes.xl,
  '--text-2xl': TYPOGRAPHY.sizes['2xl'],
  '--text-3xl': TYPOGRAPHY.sizes['3xl'],
  '--text-4xl': TYPOGRAPHY.sizes['4xl'],
  '--text-5xl': TYPOGRAPHY.sizes['5xl'],
  '--text-6xl': TYPOGRAPHY.sizes['6xl'],

  // Font weights
  '--font-thin': TYPOGRAPHY.weights.thin,
  '--font-light': TYPOGRAPHY.weights.light,
  '--font-normal': TYPOGRAPHY.weights.normal,
  '--font-medium': TYPOGRAPHY.weights.medium,
  '--font-semibold': TYPOGRAPHY.weights.semibold,
  '--font-bold': TYPOGRAPHY.weights.bold,

  // Line heights
  '--leading-none': TYPOGRAPHY.lineHeights.none,
  '--leading-tight': TYPOGRAPHY.lineHeights.tight,
  '--leading-normal': TYPOGRAPHY.lineHeights.normal,
  '--leading-relaxed': TYPOGRAPHY.lineHeights.relaxed,

  // Letter spacing
  '--tracking-tight': TYPOGRAPHY.letterSpacing.tight,
  '--tracking-normal': TYPOGRAPHY.letterSpacing.normal,
  '--tracking-wide': TYPOGRAPHY.letterSpacing.wide
} as const;

// Export types for TypeScript
export type TypographyFonts = typeof TYPOGRAPHY.fonts;
export type TypographySizes = typeof TYPOGRAPHY.sizes;
export type TypographyWeights = typeof TYPOGRAPHY.weights;
export type TextPresets = typeof TEXT_PRESETS;
export type TypographyPreset = keyof typeof TEXT_PRESETS;
