/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        gold:   { 300:'#FCD34D', 400:'#FBBF24', 500:'#F59E0B', 600:'#D97706' },
        orange: { 500:'#F97316', 600:'#EA580C' },
        surface:{ 900:'#080808', 800:'#0e0e0e', 700:'#141414', 600:'#1a1a1a', 500:'#222222' },
      },
      animation: {
        'float':   'float 6s ease-in-out infinite',
        'float-b': 'floatB 7.5s ease-in-out infinite 1s',
        'float-c': 'float 8s ease-in-out infinite 2s',
        'pulse-dot':'pulseDot 2s ease-in-out infinite',
        'blink':   'blink 1s step-end infinite',
        'toast-in':'toastIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        'bar-grow':'barGrow 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        float:    {'0%,100%':{transform:'translateY(0px) rotate(-2deg)'},'50%':{transform:'translateY(-18px) rotate(-1deg)'}},
        floatB:   {'0%,100%':{transform:'translateY(0px) rotate(2deg)'},'50%':{transform:'translateY(-14px) rotate(1deg)'}},
        pulseDot: {'0%,100%':{opacity:'1',transform:'scale(1)'},'50%':{opacity:'0.5',transform:'scale(1.5)'}},
        blink:    {'0%,100%':{opacity:'1'},'50%':{opacity:'0'}},
        toastIn:  {from:{opacity:'0',transform:'translateX(40px)'},to:{opacity:'1',transform:'translateX(0)'}},
        barGrow:  {from:{transform:'scaleY(0)'},to:{transform:'scaleY(1)'}},
      },
      boxShadow: {
        gold:     '0 0 30px rgba(245,158,11,0.25)',
        'gold-lg':'0 8px 48px rgba(245,158,11,0.35)',
        dark:     '0 20px 60px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
