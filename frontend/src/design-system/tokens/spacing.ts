/**
 * Unified Spacing and Sizing System for Error-IQ
 * Provides consistent spacing scales and sizing utilities across all components
 */

export const SPACING = {
  // Base spacing scale (in pixels, converted to rem)
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem'        // 384px
} as const;

// Semantic spacing tokens
export const SEMANTIC_SPACING = {
  // Component spacing
  component: {
    padding: {
      xs: SPACING[2],    // 8px
      sm: SPACING[3],    // 12px
      md: SPACING[4],    // 16px
      lg: SPACING[6],    // 24px
      xl: SPACING[8]     // 32px
    },
    gap: {
      xs: SPACING[1],    // 4px
      sm: SPACING[2],    // 8px
      md: SPACING[3],    // 12px
      lg: SPACING[4],    // 16px
      xl: SPACING[6]     // 24px
    },
    margin: {
      xs: SPACING[1],    // 4px
      sm: SPACING[2],    // 8px
      md: SPACING[4],    // 16px
      lg: SPACING[6],    // 24px
      xl: SPACING[8]     // 32px
    }
  },

  // Layout spacing
  layout: {
    container: {
      xs: SPACING[4],    // 16px
      sm: SPACING[6],    // 24px
      md: SPACING[8],    // 32px
      lg: SPACING[12],   // 48px
      xl: SPACING[16]    // 64px
    },
    section: {
      xs: SPACING[8],    // 32px
      sm: SPACING[12],   // 48px
      md: SPACING[16],   // 64px
      lg: SPACING[20],   // 80px
      xl: SPACING[24]    // 96px
    },
    page: {
      xs: SPACING[4],    // 16px
      sm: SPACING[6],    // 24px
      md: SPACING[8],    // 32px
      lg: SPACING[12],   // 48px
      xl: SPACING[16]    // 64px
    }
  },

  // Interactive spacing
  interactive: {
    touch: {
      min: SPACING[10],   // 40px (accessibility)
      ideal: SPACING[12]  // 48px (comfortable)
    },
    focus: {
      ring: SPACING[1],   // 4px
      offset: SPACING[1]  // 4px
    },
    hover: {
      lift: SPACING[1]    // 4px
    }
  }
} as const;

// Size tokens for components
export const SIZES = {
  // Component sizes
  button: {
    xs: {
      height: SPACING[6],    // 24px
      paddingX: SPACING[2],  // 8px
      fontSize: '0.75rem'    // 12px
    },
    sm: {
      height: SPACING[8],    // 32px
      paddingX: SPACING[3],  // 12px
      fontSize: '0.875rem'   // 14px
    },
    md: {
      height: SPACING[10],   // 40px
      paddingX: SPACING[4],  // 16px
      fontSize: '1rem'       // 16px
    },
    lg: {
      height: SPACING[12],   // 48px
      paddingX: SPACING[6],  // 24px
      fontSize: '1.125rem'   // 18px
    },
    xl: {
      height: SPACING[14],   // 56px
      paddingX: SPACING[8],  // 32px
      fontSize: '1.25rem'    // 20px
    }
  },

  input: {
    xs: {
      height: SPACING[8],    // 32px
      paddingX: SPACING[3],  // 12px
      fontSize: '0.875rem'   // 14px
    },
    sm: {
      height: SPACING[10],   // 40px
      paddingX: SPACING[3],  // 12px
      fontSize: '1rem'       // 16px
    },
    md: {
      height: SPACING[12],   // 48px
      paddingX: SPACING[4],  // 16px
      fontSize: '1rem'       // 16px
    },
    lg: {
      height: SPACING[14],   // 56px
      paddingX: SPACING[4],  // 16px
      fontSize: '1.125rem'   // 18px
    }
  },

  // Icon sizes
  icon: {
    xs: SPACING[3],    // 12px
    sm: SPACING[4],    // 16px
    md: SPACING[5],    // 20px
    lg: SPACING[6],    // 24px
    xl: SPACING[8],    // 32px
    '2xl': SPACING[10], // 40px
    '3xl': SPACING[12]  // 48px
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.25rem',    // 4px
    lg: '0.375rem',   // 6px
    xl: '0.5rem',     // 8px
    '2xl': '0.75rem', // 12px
    '3xl': '1rem',    // 16px
    full: '9999px'
  },

  // Shadows
  shadow: {
    none: 'none',
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  }
} as const;

// CSS custom properties for spacing
export const SPACING_CSS_VARIABLES = {
  // Spacing scale
  '--space-0': SPACING[0],
  '--space-1': SPACING[1],
  '--space-2': SPACING[2],
  '--space-3': SPACING[3],
  '--space-4': SPACING[4],
  '--space-5': SPACING[5],
  '--space-6': SPACING[6],
  '--space-8': SPACING[8],
  '--space-10': SPACING[10],
  '--space-12': SPACING[12],
  '--space-16': SPACING[16],
  '--space-20': SPACING[20],
  '--space-24': SPACING[24],

  // Component spacing
  '--component-padding-xs': SEMANTIC_SPACING.component.padding.xs,
  '--component-padding-sm': SEMANTIC_SPACING.component.padding.sm,
  '--component-padding-md': SEMANTIC_SPACING.component.padding.md,
  '--component-padding-lg': SEMANTIC_SPACING.component.padding.lg,
  '--component-padding-xl': SEMANTIC_SPACING.component.padding.xl,

  // Layout spacing
  '--layout-container-md': SEMANTIC_SPACING.layout.container.md,
  '--layout-section-md': SEMANTIC_SPACING.layout.section.md,
  '--layout-page-md': SEMANTIC_SPACING.layout.page.md,

  // Interactive spacing
  '--interactive-touch-min': SEMANTIC_SPACING.interactive.touch.min,
  '--interactive-focus-ring': SEMANTIC_SPACING.interactive.focus.ring,

  // Sizes
  '--button-height-md': SIZES.button.md.height,
  '--input-height-md': SIZES.input.md.height,
  '--icon-size-md': SIZES.icon.md,

  // Border radius
  '--radius-sm': SIZES.radius.sm,
  '--radius-md': SIZES.radius.md,
  '--radius-lg': SIZES.radius.lg,
  '--radius-xl': SIZES.radius.xl,

  // Shadows
  '--shadow-sm': SIZES.shadow.sm,
  '--shadow-md': SIZES.shadow.md,
  '--shadow-lg': SIZES.shadow.lg
} as const;

// Utility functions
export const getSpacing = (value: keyof typeof SPACING) => SPACING[value];
export const getSize = (component: keyof typeof SIZES, variant: string, property: string) => {
  const componentSizes = SIZES[component] as any;
  return componentSizes?.[variant]?.[property];
};

// Export types for TypeScript
export type SpacingScale = keyof typeof SPACING;
export type SemanticSpacing = typeof SEMANTIC_SPACING;
export type ComponentSizes = typeof SIZES;
