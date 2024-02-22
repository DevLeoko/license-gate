<script lang="ts">
	export let title: string
	export let selected: boolean

	export let slim = false
</script>

<div
	class="px-4 bg-white rounded-lg option-card max-w-56"
	class:py-4={!slim}
	class:py-2={slim}
	class:selected
	on:click
>
	<h4 class="font-semibold">{title}</h4>
	<p class="text-sm">
		<slot />
	</p>
</div>

<style lang="postcss">
	.option-card {
		cursor: pointer;
		@apply border border-gray-300;
	}

	.option-card.selected {
		@apply border-blue-500 bg-blue-50 bg-opacity-50;
	}

	.option-card:hover {
		@apply border-blue-300;
	}
</style>
