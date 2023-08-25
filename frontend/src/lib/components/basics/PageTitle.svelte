<script lang="ts">
	import { goto } from '$app/navigation'

	export let title = ''
	export let backLink: string | null = null
</script>

<div class="flex items-center justify-between gap-4 mb-4">
	<h1 class="!mb-0 pageTitle">
		{#if backLink}
			<span class="material-icons back-nav" on:click={() => goto(backLink || '/')}>arrow_back</span>
		{/if}

		<slot name="title">
			{title}
		</slot>
	</h1>
	<div class="flex flex-wrap justify-end gap-2">
		<slot />
	</div>
</div>
