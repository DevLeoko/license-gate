<script lang="ts">
	import ConfirmationCard from './ConfirmationCard.svelte'

	let showConfirmationCard = false

	export let loading = false

	export let preferLeft = false
</script>

<div class="relative">
	<div on:click={() => (showConfirmationCard = true)}>
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
