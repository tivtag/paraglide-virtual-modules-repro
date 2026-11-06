<script>
	import { m } from './paraglide/messages.js';

	let { text = m.hello_world() } = $props();
</script>

<p>{text}</p>
