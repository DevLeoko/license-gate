<script lang="ts" context="module">
	type Valuable<V> = { value: V }
</script>

<script lang="ts">
	import Button from './Button.svelte'
	import CardActionButton from './CardActionButton.svelte'
	import FloatingCardTrigger from './FloatingCardTrigger.svelte'

	export let title: string
	export let selected: string[] = []
	export let options: { value: string }[] = []
</script>

<FloatingCardTrigger>
	<svelte:fragment slot="trigger">
		<Button gray outlined class="!border-dashed" snug>
			<span class="text-base material-icons">add_circle_outline</span>
			{title}

			{#if selected.length}
				<div class="w-px h-4 mx-1 bg-gray-300">&nbsp;</div>

				{#each selected as value}
					<slot name="selected" {value} option={options.find((o) => o.value == value)} />
				{/each}
			{/if}
		</Button>
	</svelte:fragment>

	<div class="flex flex-col">
		{#each options as option (option.value)}
			<CardActionButton
				on:click={(ev) => {
					ev.stopPropagation()
					if (selected.includes(option.value)) {
						selected = selected.filter((v) => v != option.value)
					} else {
						selected = [...selected, option.value]
					}
				}}
			>
				<input type="checkbox" checked={selected.includes(option.value)} />

				<slot name="option" {option} />
			</CardActionButton>
		{/each}
	</div>
</FloatingCardTrigger>
