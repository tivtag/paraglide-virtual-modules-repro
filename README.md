# Paraglide JS `virtual-modules` reproductions

Minimal reproductions for three reports about `outputStructure: "virtual-modules"`,
the Vite default of `@inlang/paraglide-js` since 3.0.0. Each folder is a project of
its own, pinned to `@inlang/paraglide-js` 3.2.0.

| Folder | Report | Issue |
| --- | --- | --- |
| [`01-vitest-cache`](01-vitest-cache) | Vitest's module cache keeps rewritten message imports after the output structure changes outside the Vite config | [opral/paraglide-js#878](https://github.com/opral/paraglide-js/issues/878) |
| [`02-default-value`](02-default-value) | A message read in a default value is treated as unsafe, so the module keeps the whole barrel | [opral/paraglide-js#879](https://github.com/opral/paraglide-js/issues/879) |
| [`03-browser-tests`](03-browser-tests) | One module per message makes Vitest browser-mode tests several times slower than `locale-modules` | [opral/paraglide-js#880](https://github.com/opral/paraglide-js/issues/880) |

Requirements: Node.js 22.12 or later in 22.x, 24.x, or 26 and later (as Vite 8.3.6 and
Vitest 5.1.0 require), and pnpm. The reported runs used Node.js 26.13.0 and pnpm 12.18.0. The inlang project loads its message
format plugin from cdn.jsdelivr.net on the first compile.

## 01-vitest-cache

```sh
cd 01-vitest-cache
pnpm install
pnpm exec vitest run          # passes (virtual-modules)
echo "export default { outputStructure: 'locale-modules' };" > project.inlang/paraglide.config.js
pnpm exec vitest run          # fails: "... without null bytes. Received '\x00virtual:paraglide/<id>/messages/hello_world.js'"
pnpm exec vitest --clearCache
pnpm exec vitest run          # passes again
rm project.inlang/paraglide.config.js
```

## 02-default-value

```sh
cd 02-default-value
pnpm install
node show-transform.mjs       # hello.js imports hello_world alone, hello-default.js imports the barrel `m`
node show-svelte-output.mjs   # how Svelte 5 compiles a message used as a prop default
```

## 03-browser-tests

```sh
cd 03-browser-tests
pnpm install
pnpm exec playwright install chromium
node generate.mjs             # 8,000 messages, 80 feature modules, 100 browser test files
./compare.sh 3                # alternates virtual-modules and locale-modules, prints Vitest's Duration
```

`node generate.mjs [messages] [features] [tests] [featuresPerTest]` changes the size.
The generated files are not committed.

## About these reproductions

They were written by Claude Opus 5.5 (Anthropic) and cross-checked by OpenAI Codex. Every
quoted output comes from running them.

## License

MIT
