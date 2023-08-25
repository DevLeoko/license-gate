<script lang="ts">
	import Button from './Button.svelte'

	export let items: any = []
	export let itemsPerPage = 100
	let currentPage = 1

	let scrollContainer: HTMLDivElement

	$: numPages = Math.ceil(items.length / itemsPerPage)
	$: pageSize = Math.min(itemsPerPage, items.length - (currentPage - 1) * itemsPerPage)

	$: {
		currentPage
		if (scrollContainer) scrollContainer.scrollTop = 0
	}
</script>

<div class="flex flex-col items-stretch flex-1 overflow-y-auto">
	<div class="flex flex-col overflow-y-auto" bind:this={scrollContainer}>
		{#each { length: pageSize } as _, i (i + (currentPage - 1) * itemsPerPage)}
			<slot index={i + (currentPage - 1) * itemsPerPage} isFirst={i == 0} />
		{/each}
	</div>

	<div class="flex items-center justify-between mt-2 gap-x-4">
		<Button on:click={() => currentPage--} disabled={currentPage === 1}>Previous</Button>

		<div class="flex">
			<span>Page:</span>
			<input
				type="number"
				class="w-10 mx-1 text-right border border-gray-600"
				min="1"
				max={numPages}
				bind:value={currentPage}
			/>
			/ {numPages}
		</div>

		<Button on:click={() => currentPage++} disabled={currentPage === numPages}>Next</Button>
	</div>
</div>
