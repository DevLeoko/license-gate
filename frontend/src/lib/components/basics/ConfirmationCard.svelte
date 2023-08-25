<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import Button from './Button.svelte'
	import FloatingCard from './FloatingCard.svelte'

	export let loading = false
	export let preferLeft = false

	const dispatchEvent = createEventDispatcher<{
		confirm: MouseEvent
		cancel: MouseEvent
	}>()

	function handleYes(event: CustomEvent<MouseEvent>) {
		event.stopPropagation()
		dispatchEvent('confirm', event.detail)
	}

	function handleNo(event: CustomEvent<MouseEvent>) {
		event.stopPropagation()
		dispatchEvent('cancel', event.detail)
	}
</script>

<FloatingCard on:clickOutside={handleNo} preferTop {preferLeft} class="confirm-card">
	<div class="mr-4">Are you sure?</div>
	<Button snug red {loading} class="mr-2" on:click={handleYes}>Yes</Button>
	<Button snug gray on:click={handleNo}>Cancel</Button>
</FloatingCard>
