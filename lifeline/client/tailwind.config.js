export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { DEFAULT: '#f87171', dark: '#dc2626' },
      },
      screens: {
        xs: '375px',
      }
    }
  },
  plugins: []
}
