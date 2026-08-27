/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  corePlugins: {
    // Avoid preflight reset collision with MUI CssBaseline & globals.css
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8C61',
          dark: '#E65A2E',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          light: '#6FD9D1',
          dark: '#3BB5AD',
        },
      },
    },
  },
  plugins: [],
}
