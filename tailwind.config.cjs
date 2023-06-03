/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require("daisyui")],
	daisyui: {
		themes: ["light", "dark", "cyberpunk", "aqua", "forest", "wireframe", "night", "winter"],
	},
};

module.exports = config;
