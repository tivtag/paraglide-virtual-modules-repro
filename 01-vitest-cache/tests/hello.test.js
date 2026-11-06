import { expect, test } from 'vitest';
import { hello } from '../src/hello.js';

test('hello', () => {
	expect(hello()).toBe('Hello, world');
});
