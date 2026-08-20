/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx}', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#000615',
        primaryContainer: '#0b1f3a',
        secondary: '#7b580b',
        secondaryContainer: '#fdcd78',
        tertiaryOnContainer: '#30967a',
        background: '#fbf9f4',
        surfaceContainerLow: '#f5f3ee',
        surfaceContainerHigh: '#eae8e3',
        onSurface: '#1b1c19',
        onSurfaceVariant: '#44474d',
        outlineVariant: '#c4c6ce',
        error: '#ba1a1a',
      },
      borderRadius: { sm: 4, DEFAULT: 8, lg: 16, xl: 24, full: 9999 },
      spacing: { base: 8, sm: 12, md: 16, lg: 24, xl: 32 },
      fontFamily: { inter: ['Inter'] },
    },
  },
  plugins: [],
};
