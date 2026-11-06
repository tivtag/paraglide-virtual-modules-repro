// Prints the imports Vite's SSR environment serves for a message read in a
// function body and for the same read in a default value.
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
for (const file of ['/src/hello.js', '/src/hello-default.js']) {
	const { code } = await server.environments.ssr.transformRequest(file);
	const imports = code.split('\n').filter((line) => line.includes('import'));
	console.log(`${file}:\n  ${imports.join('\n  ')}`);
}
await server.close();
