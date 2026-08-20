/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1b1c19',
        navy: '#0b1f3a',
        bronze: '#7b580b',
        gold: '#fdcd78',
        ivory: '#fbf9f4',
        surface: '#f5f3ee',
        'surface-high': '#eae8e3',
        muted: '#44474d',
        line: '#c4c6ce',
        green: '#30967a',
        brand: {
          50: '#f5f3ee',
          100: '#fdcd78',
          500: '#7b580b',
          600: '#0b1f3a',
          700: '#000615',
        },
      },
    },
  },
  plugins: [],
};
