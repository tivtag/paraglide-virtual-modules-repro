// Prints how Svelte 5 compiles a message used as a prop default, for the
// server and for the client.
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const source = readFileSync('src/Greeting.svelte', 'utf8');
for (const generate of ['server', 'client']) {
	const { js } = compile(source, { generate, filename: 'Greeting.svelte' });
	const line = js.code.split('\n').find((l) => l.includes('hello_world'));
	console.log(`${generate}: ${line.trim()}`);
}
