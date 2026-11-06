// Generates the reproduction: a message catalog in three locales, feature
// modules that each use 100 messages of the catalog through `import { m }`,
// and browser test files that each import and render several features.
// Usage: node generate.mjs [messages] [features] [tests] [featuresPerTest]
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const MESSAGES = Number(process.argv[2] ?? 8000);
const FEATURES = Number(process.argv[3] ?? 80);
const TESTS = Number(process.argv[4] ?? 100);
const PER_FEATURE = 100;
const PER_TEST = Number(process.argv[5] ?? 10);

for (const dir of ['messages', 'src/features', 'tests']) {
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
}
for (const [locale, word] of [['en', 'Message'], ['de', 'Nachricht'], ['fr', 'Message']]) {
	const catalog = { $schema: 'https://inlang.com/schema/inlang-message-format' };
	for (let i = 0; i < MESSAGES; i++)
		catalog[`msg_${i}`] = i % 3 === 0 ? `${word} ${i} for {name}` : `${word} ${i}`;
	writeFileSync(`messages/${locale}.json`, JSON.stringify(catalog, null, '\t'));
}
for (let f = 0; f < FEATURES; f++) {
	const keys = Array.from({ length: PER_FEATURE }, (_, k) => (f * 37 + k * 11) % MESSAGES);
	const calls = keys.map((i) => (i % 3 === 0 ? `m.msg_${i}({ name: 'example' })` : `m.msg_${i}()`));
	writeFileSync(
		`src/features/feature${f}.js`,
		`import { m } from '../paraglide/messages.js';\n\nexport function render() {\n\treturn [\n\t\t${calls.join(',\n\t\t')}\n\t].join('\\n');\n}\n`
	);
}
for (let t = 0; t < TESTS; t++) {
	const features = Array.from({ length: PER_TEST }, (_, k) => (t * 7 + k * 13) % FEATURES);
	const imports = features.map((f, k) => `import { render as f${k} } from '../src/features/feature${f}.js';`);
	const checks = features.map((_, k) => `\tdocument.body.textContent = f${k}();\n\texpect(document.body.textContent).toContain('Message');`);
	writeFileSync(
		`tests/t${t}.test.js`,
		`import { expect, test } from 'vitest';\n${imports.join('\n')}\n\ntest('renders its features', () => {\n${checks.join('\n')}\n});\n`
	);
}
console.log(`${MESSAGES} messages x 3 locales, ${FEATURES} features x ${PER_FEATURE} messages, ${TESTS} test files x ${PER_TEST} features`);
