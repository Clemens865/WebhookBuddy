/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'neon-pulse': '#d0f138', // Primary accent for active states, buttons, and selection
        'neon-pulse-hover': '#e1ff4a', // Lighter variant for hover states
        'neon-pulse-active': '#b3d025', // Darker variant for active/pressed states
        'void-black': '#121214', // Primary background color
        'surface-gray': '#1e1e1e', // Container background, one level up from primary background
        
        // Secondary Colors
        'card-gray': '#252527', // Card backgrounds and secondary containers
        'input-field': '#2c2c2e', // Form input backgrounds
        'highlight-gray': '#33333a', // Hover state for non-accent elements
        
        // Functional Colors
        'success': '#2dd4bf', // Success states and confirmations
        'warning': '#fbbf24', // Warning states and alerts
        'error': '#f43f5e', // Error states and destructive actions
        'info': '#38bdf8', // Informational elements and links
        
        // Gray Scale
        'divider-gray': '#38383c', // Subtle divider lines
        'border-gray': '#49494e', // Container borders
        'icon-gray': '#8a8a8a', // Secondary icons and inactive text
        'text-secondary': '#a1a1aa', // Secondary and supporting text
        'text-primary': '#ffffff', // Primary text color
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }], // 12px/16px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px/20px
        'base': ['1rem', { lineHeight: '1.5rem' }], // 16px/24px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px/28px
        'xl': ['1.25rem', { lineHeight: '1.875rem' }], // 20px/30px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px/32px
      },
      spacing: {
        '4': '0.25rem', // 4px
        '8': '0.5rem', // 8px
        '12': '0.75rem', // 12px
        '16': '1rem', // 16px
        '20': '1.25rem', // 20px
        '24': '1.5rem', // 24px
        '32': '2rem', // 32px
        '40': '2.5rem', // 40px
        '48': '3rem', // 48px
        '64': '4rem', // 64px
      },
      borderRadius: {
        'sm': '0.25rem', // 4px
        DEFAULT: '0.375rem', // 6px
        'md': '0.5rem', // 8px
        'lg': '0.75rem', // 12px
        'xl': '1rem', // 16px
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
