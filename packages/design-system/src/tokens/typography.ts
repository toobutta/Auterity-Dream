// Auterity Unified Typography System
export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
    display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif']
  },

  // Font sizes with responsive scaling
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }]
  },

  // Font weights
  fontWeight: {
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

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // Text styles (combinations)
  textStyle: {
    caption: {
      fontSize: 'font-size-sm',
      fontWeight: 'font-weight-normal',
      lineHeight: 'line-height-tight',
      letterSpacing: 'letter-spacing-wide'
    },
    body: {
      fontSize: 'font-size-base',
      fontWeight: 'font-weight-normal',
      lineHeight: 'line-height-normal'
    },
    'body-large': {
      fontSize: 'font-size-lg',
      fontWeight: 'font-weight-normal',
      lineHeight: 'line-height-relaxed'
    },
    label: {
      fontSize: 'font-size-sm',
      fontWeight: 'font-weight-medium',
      lineHeight: 'line-height-tight',
      letterSpacing: 'letter-spacing-wide'
    },
    heading: {
      fontFamily: 'font-family-display',
      fontWeight: 'font-weight-bold',
      letterSpacing: 'letter-spacing-tight'
    },
    'heading-large': {
      fontSize: 'font-size-4xl',
      fontWeight: 'font-weight-bold',
      lineHeight: 'line-height-none',
      letterSpacing: 'letter-spacing-tighter'
    },
    code: {
      fontFamily: 'font-family-mono',
      fontSize: 'font-size-sm',
      lineHeight: 'line-height-relaxed'
    }
  }
} as const;

export type TypographySystem = typeof typography;
