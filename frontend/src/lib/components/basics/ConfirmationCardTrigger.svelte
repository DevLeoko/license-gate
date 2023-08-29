<script lang="ts">
	import ConfirmationCard from './ConfirmationCard.svelte'

	let showConfirmationCard = false

	export let loading = false

	export let preferLeft = false

	let className = ''

	export { className as class }
</script>

<div class="relative {className}">
	<div on:click|stopPropagation={() => (showConfirmationCard = true)}>
		<slot />
	</div>

	{#if showConfirmationCard}
		<ConfirmationCard
			{loading}
			on:cancel={() => (showConfirmationCard = false)}
			{preferLeft}
			on:confirm
		/>
	{/if}
</div>
