<script lang="ts">
	import FloatingCard from './FloatingCard.svelte'

	export let showFloatingCard = false
	export let preferTop = false
	export let preferLeft = false

	export let triggerClass = ''
	export let cardClass = ''
</script>

<div class="relative">
	<div on:click={() => (showFloatingCard = true)} class="cursor-pointer {triggerClass}">
		<slot name="trigger" />
	</div>

	{#if showFloatingCard}
		<FloatingCard
			{preferTop}
			{preferLeft}
			on:clickOutside={() => (showFloatingCard = false)}
			on:click={() => (showFloatingCard = false)}
			class="cursor-default {cardClass}"
		>
			<slot />
		</FloatingCard>
	{/if}
</div>
