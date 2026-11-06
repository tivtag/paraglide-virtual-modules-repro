import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// PARAGLIDE_OUTPUT=locale-modules|message-modules picks a physical layout;
// unset, the plugin uses its Vite default, virtual-modules.
const outputStructure = process.env.PARAGLIDE_OUTPUT;

export default defineConfig({
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/paraglide',
			...(outputStructure ? { outputStructure } : {})
		})
	],
	test: {
		include: ['tests/**/*.test.js'],
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: [{ browser: 'chromium' }]
		}
	}
});
