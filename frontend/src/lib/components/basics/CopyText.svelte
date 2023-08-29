<script lang="ts">
	import { fade, fly } from 'svelte/transition'

	export let text = ''

	let copied = false

	function copy() {
		navigator.clipboard.writeText(text)
		copied = true
	}

	$: if (copied) {
		setTimeout(() => {
			copied = false
		}, 2000)
	}

	let className = ''

	export { className as class }
</script>

{#if copied}
	<span in:fly|local={{ y: -20, duration: 150 }} class="text-green-500 material-icons {className}"
		>done_all</span
	>
{:else}
	<span
		in:fade|local
		class="text-gray-500 cursor-pointer material-icons {className}"
		on:click={copy}>content_copy</span
	>
{/if}
