<script lang="ts">
	import Skeleton from './Skeleton.svelte'

	export let icon: string

	export let loading = false
</script>

<div on:click class="relative floating-action">
	{#if loading}
		<Skeleton class="!absolute inset-0 opacity-70" />
	{/if}

	<span class="mr-1 text-sm material-icons">{icon}</span>
	<slot />
</div>
