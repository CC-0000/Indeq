import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ["Work Sans", "sans-serif"],
			},
			colors: {
				primary: "#6b8aed", // A professional light blue color
				secondary: "#f8f9fa", // Light background color
			},
		}
	},

	plugins: [typography]
} satisfies Config;
