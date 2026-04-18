/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: { DEFAULT: '#0D1117', card: '#131920', border: '#1E2229' },
        brand: { DEFAULT: '#F87171', dark: '#DC2626', muted: '#1C1117' },
      },
      borderRadius: { xl2: '20px', xl3: '28px' }
    }
  },
  plugins: []
}
