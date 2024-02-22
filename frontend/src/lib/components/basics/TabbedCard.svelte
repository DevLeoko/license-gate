<script lang="ts" generics="S extends string">
	export let options: S[] = []
	export let selected: S | null = null
</script>

<div class="bg-white border rounded-lg">
	<div class="flex px-4 pt-2 bg-gray-100 rounded-t-lg">
		{#each options as option}
			<div
				class="px-4 py-0.5 border-b cursor-pointer"
				class:border-transparent={selected !== option}
				class:border-blue-500={selected === option}
				class:font-medium={selected === option}
				on:click={() => (selected = option)}
			>
				{option}
			</div>
		{/each}
	</div>

	<div class="px-4 py-2"><slot {selected} /></div>
</div>
