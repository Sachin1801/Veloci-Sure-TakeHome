/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'siri-pulse': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'siri-pulse-sm': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        'siri-pulse-in': {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(0.6)', opacity: '0' },
        },
      },
      animation: {
        'siri-pulse': 'siri-pulse 2s cubic-bezier(0.4,0,0.2,1) infinite',
        'siri-pulse-sm': 'siri-pulse-sm 1.8s cubic-bezier(0.4,0,0.2,1) infinite',
        'siri-pulse-in': 'siri-pulse-in 2.2s cubic-bezier(0.4,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
};
