#!/usr/bin/env bash
# Runs the browser tests alternately with virtual-modules (the Vite default)
# and locale-modules and prints Vitest's reported duration of each run.
# Usage: ./compare.sh [rounds]
set -euo pipefail
rounds=${1:-3}
for ((i = 1; i <= rounds; i++)); do
	for layout in virtual-modules locale-modules; do
		output=$(PARAGLIDE_OUTPUT="$layout" pnpm exec vitest run 2>&1)
		duration=$(sed -n 's/.*Duration *\([0-9.]* *m*s\).*/\1/p' <<<"$output" | tail -1)
		echo "round $i  $layout  $duration"
	done
done
