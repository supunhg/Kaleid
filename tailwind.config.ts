import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        glitch: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          yellow: '#ffff00',
        },
      },
      animation: {
        'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite',
        'glitch-2': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) reverse both infinite',
      },
      keyframes: {
        glitch: {
          '0%': {
            transform: 'translate(0)',
          },
          '20%': {
            transform: 'translate(-2px, 2px)',
          },
          '40%': {
            transform: 'translate(-2px, -2px)',
          },
          '60%': {
            transform: 'translate(2px, 2px)',
          },
          '80%': {
            transform: 'translate(2px, -2px)',
          },
          '100%': {
            transform: 'translate(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
