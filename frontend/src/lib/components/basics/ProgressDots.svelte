<script lang="ts">
	export let totalSteps: number
	export let step: number

	let className = ''

	export { className as class }
</script>

<div class="flex items-center justify-center {className}">
	{#each Array(totalSteps) as _, i}
		<div class="w-2 h-2 {i <= step ? 'bg-blue-500' : 'bg-gray-300'} rounded-full" />
		{#if i !== totalSteps - 1}
			<div class="w-4 h-0.5 {i <= step - 1 ? 'bg-blue-500' : 'bg-gray-300'}" />
		{/if}
	{/each}
</div>
