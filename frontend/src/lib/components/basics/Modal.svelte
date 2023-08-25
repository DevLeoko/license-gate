<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'

	export let zLevel = 40

	const dispatchEvent = createEventDispatcher()

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			dispatchEvent('exit')
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown)

		return () => {
			document.removeEventListener('keydown', handleKeydown)
		}
	})
</script>

<div
	class="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-blur"
	style:z-index={zLevel}
	on:click|self={() => dispatchEvent('exit')}
	on:keydown={handleKeydown}
>
	<slot />
</div>

<style>
	.bg-blur {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
	}
</style>
