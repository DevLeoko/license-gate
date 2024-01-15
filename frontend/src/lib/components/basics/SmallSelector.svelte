<script lang="ts" generics="T">
	import FloatingCardTrigger from './FloatingCardTrigger.svelte'

	import Button from './Button.svelte'

	export let items: T[] = []
	export let value: T | null = null
</script>

<FloatingCardTrigger>
	<svelte:fragment slot="trigger">
		<Button snug outlined gray>
			<slot name="element" {value} />
			<span class="material-icons"> arrow_drop_down </span>
		</Button>
	</svelte:fragment>

	<div class="flex flex-col space-y-1">
		{#each items as item}
			<div
				class="floating-action flex items-center cursor-pointer {item == value
					? 'font-medium text-blue-500'
					: ''}"
				on:click={() => (value = item)}
			>
				<slot name="item" {item} />
			</div>
		{/each}
	</div>
</FloatingCardTrigger>
