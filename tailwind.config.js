/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFCF7',
          100: '#FFF7ED',
          200: '#FDEEDC',
          300: '#F7E0C8',
        },
        milk: '#FFFDFA',
        cocoa: {
          400: '#B99A82',
          600: '#8A6A52',
          800: '#5C4536',
        },
        peach: {
          300: '#FFC4A8',
          400: '#FFA987',
          500: '#F58E68',
        },
        mint: {
          300: '#A8DBC5',
          500: '#6FBFA0',
          700: '#4A9B7C',
        },
        berry: {
          300: '#F5AFC0',
          500: '#E77D97',
        },
        sky: {
          300: '#AFD3F0',
          500: '#7BB3DE',
        },
      },
      fontFamily: {
        hand: [
          '"Kalam"',
          '"Comic Sans MS"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        body: [
          '"Nunito"',
          '-apple-system',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
      },
      borderRadius: {
        blob: '2rem',
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(138, 106, 82, 0.16)',
        lift: '0 10px 32px -8px rgba(138, 106, 82, 0.24)',
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.94) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
        wiggle: 'wiggle 0.6s ease-in-out',
        'float-slow': 'float-slow 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
