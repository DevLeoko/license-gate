<script lang="ts">
	import { goto } from '$app/navigation'

	export let title = ''
	export let backLink: string | null = null
	export let backAction: (() => void) | null = null
	export let closeIcon = false

	$: onBack = backAction || (() => goto(backLink || '/'))
</script>

<div class="flex items-center justify-between gap-4 mb-4">
	<h1 class="!mb-0 pageTitle">
		{#if backLink || backAction}
			<span class="material-icons back-nav" on:click={onBack}>
				{closeIcon ? 'close' : 'arrow_back'}
			</span>
		{/if}

		<slot name="title">
			{title}
		</slot>
	</h1>
	<div class="flex flex-wrap justify-end gap-2">
		<slot />
	</div>
</div>
