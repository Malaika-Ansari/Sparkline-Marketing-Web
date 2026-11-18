/**
 * Sparkline Marketing Design System Tokens
 * Defines the complete visual language, brand palette, accessible shades,
 * typography scale, spacing, radii, shadows, and z-index hierarchy.
 */

export const tokens = {
  colors: {
    // Brand Colors (Official Palette)
    brand: {
      midnight: '#071329',
      slate: '#152238',
      blue: '#0C65F4',
      purple: '#593090',
      magenta: '#C52B85',
      cyan: '#2292D9',
      orange: '#E37C33',
      cloud: '#F5F7FC',
    },

    // Extended Accessible Shades for UI States
    blue: {
      50: '#EBF3FE',
      100: '#D6E6FD',
      200: '#ADD0FC',
      300: '#75B0FA',
      400: '#3D90F7',
      500: '#0C65F4', // Brand Electric Blue
      600: '#0A52C6', // Hover
      700: '#08409A', // Active
      800: '#063073',
      900: '#041F4D',
    },

    purple: {
      50: '#F4EEFB',
      100: '#E6D7F6',
      200: '#CDB1ED',
      300: '#B085E3',
      400: '#8C57D2',
      500: '#593090', // Brand Royal Purple
      600: '#462572', // Hover
      700: '#351B56', // Active
      800: '#26123E',
      900: '#190A2A',
    },

    magenta: {
      50: '#FDF0F7',
      100: '#FBDCED',
      200: '#F7B5DB',
      300: '#F182C3',
      400: '#E54EA5',
      500: '#C52B85', // Brand Magenta
      600: '#A4216E', // Hover
      700: '#821856', // Active
      800: '#631041',
      900: '#45092C',
    },

    cyan: {
      50: '#EDF7FD',
      100: '#D7EDFB',
      200: '#B0DAF6',
      300: '#7FC2EF',
      400: '#4DA5E5',
      500: '#2292D9', // Brand Sky Cyan
      600: '#1976B2', // Hover
      700: '#135B8C', // Active
      800: '#0D4267',
      900: '#082C46',
    },

    orange: {
      50: '#FDF5EE',
      100: '#FBE8D8',
      200: '#F7CFB0',
      300: '#F1B082',
      400: '#EB9456',
      500: '#E37C33', // Brand Growth Orange
      600: '#C7631E', // Hover
      700: '#A54F15', // Active
      800: '#823C0E',
      900: '#5F2A08',
    },

    navy: {
      50: '#EAEFF8',
      100: '#CCD8ED',
      200: '#99B1DB',
      300: '#6689C8',
      400: '#3362B6',
      500: '#071329', // Brand Midnight Navy
      600: '#050F21',
      700: '#040B18',
      800: '#020710',
      900: '#010308',
    },

    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#152238', // Brand Deep Slate
      900: '#0F172A',
      950: '#071329',
    },

    // Semantic Status Colors
    semantic: {
      success: {
        light: '#ECFDF5',
        border: '#A7F3D0',
        text: '#065F46',
        main: '#10B981',
      },
      warning: {
        light: '#FFFBEB',
        border: '#FDE68A',
        text: '#92400E',
        main: '#F59E0B',
      },
      error: {
        light: '#FEF2F2',
        border: '#FECACA',
        text: '#991B1B',
        main: '#EF4444',
      },
      info: {
        light: '#EFF6FF',
        border: '#BFDBFE',
        text: '#1E40AF',
        main: '#0C65F4',
      },
    },

    // Surfaces & Backgrounds
    surface: {
      workspace: '#F5F7FC',
      card: '#FFFFFF',
      cardDark: '#152238',
      sidebar: '#071329',
      dropdown: '#FFFFFF',
      modal: '#FFFFFF',
      muted: '#F8FAFC',
      borderSubtle: '#E2E8F0',
      borderDark: 'rgba(255, 255, 255, 0.08)',
    },
  },

  typography: {
    fonts: {
      headings: '"Plus Jakarta Sans", "Inter", sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    sizes: {
      display: {
        size: '3.75rem', // 60px
        lineHeight: '1.1',
        letterSpacing: '-0.03em',
        weight: '800',
      },
      h1: {
        size: '2.5rem', // 40px
        lineHeight: '1.2',
        letterSpacing: '-0.025em',
        weight: '700',
      },
      h2: {
        size: '1.875rem', // 30px
        lineHeight: '1.25',
        letterSpacing: '-0.02em',
        weight: '700',
      },
      h3: {
        size: '1.375rem', // 22px
        lineHeight: '1.3',
        letterSpacing: '-0.015em',
        weight: '600',
      },
      h4: {
        size: '1.125rem', // 18px
        lineHeight: '1.35',
        letterSpacing: '-0.01em',
        weight: '600',
      },
      bodyLarge: {
        size: '1.125rem', // 18px
        lineHeight: '1.6',
        letterSpacing: '0',
        weight: '400',
      },
      bodyMedium: {
        size: '1rem', // 16px
        lineHeight: '1.5',
        letterSpacing: '0',
        weight: '400',
      },
      bodySmall: {
        size: '0.875rem', // 14px
        lineHeight: '1.5',
        letterSpacing: '0',
        weight: '400',
      },
      caption: {
        size: '0.75rem', // 12px
        lineHeight: '1.4',
        letterSpacing: '0.01em',
        weight: '500',
      },
      overline: {
        size: '0.6875rem', // 11px
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        weight: '700',
        textTransform: 'uppercase',
      },
    },
  },

  borderRadius: {
    none: '0px',
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  shadows: {
    subtle: '0 1px 3px 0 rgba(7, 19, 41, 0.05), 0 1px 2px -1px rgba(7, 19, 41, 0.05)',
    card: '0 4px 6px -1px rgba(7, 19, 41, 0.06), 0 2px 4px -2px rgba(7, 19, 41, 0.04)',
    cardHover: '0 10px 15px -3px rgba(7, 19, 41, 0.08), 0 4px 6px -4px rgba(7, 19, 41, 0.04)',
    premium: '0 20px 25px -5px rgba(7, 19, 41, 0.1), 0 8px 10px -6px rgba(7, 19, 41, 0.04)',
    dropdown: '0 12px 28px 0 rgba(7, 19, 41, 0.12), 0 4px 10px 0 rgba(7, 19, 41, 0.06)',
    modal: '0 25px 50px -12px rgba(7, 19, 41, 0.25)',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  zIndex: {
    dropdown: 50,
    sticky: 40,
    drawer: 60,
    modal: 70,
    popover: 80,
    toast: 90,
    tooltip: 100,
  },
} as const;

export type DesignTokens = typeof tokens;

