<script lang="ts">
	import Skeleton from './Skeleton.svelte'

	export let icon: string = ''

	export let loading = false
</script>

<div on:click class="relative flex items-center gap-1 floating-action">
	{#if loading}
		<Skeleton class="!absolute inset-0 opacity-70" />
	{/if}

	{#if icon}
		<span class="mr-1 text-sm material-icons">{icon}</span>
	{/if}
	<slot />
</div>
