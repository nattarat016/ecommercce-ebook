/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			container: {
				center: true,
				padding: '1rem',
			},

      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
			},

			keyframes: {
				'scroll-left': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' },
				},
				'scroll-right': {
					'0%': { transform: 'translateX(-50%)' },
					'100%': { transform: 'translateX(0)' },
				},
			},
			animation: {
				'scroll-left': 'scroll-left 30s linear infinite',
				'scroll-right': 'scroll-right 30s linear infinite',
			},
		},
	},
	plugins: [],
};
