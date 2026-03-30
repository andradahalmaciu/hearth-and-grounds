/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#6b8f67',
          light: '#d4e4d2',
          dark: '#3d5e3a',
        },
        clay: {
          DEFAULT: '#b87355',
          light: '#f0d5c2',
        },
        dusty: {
          DEFAULT: '#c4908e',
          light: '#f5e8e8',
        },
        walnut: {
          DEFAULT: '#5c3d2e',
          dark: '#3a2518',
        },
        parchment: '#f9f4ec',
        espresso: '#2c1a0e',
        linen: '#f2e8d9',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
