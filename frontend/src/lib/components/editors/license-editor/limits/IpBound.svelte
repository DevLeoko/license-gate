<script lang="ts">
	import type { CreateLicense } from '../../../../trpcClient'

	export let entity: CreateLicense
</script>

<div class="flex items-center gap-2">
	<span class="text-sm font-semibold">IP Bound enabled:</span>
	<input type="checkbox" bind:checked={entity.ipBoundEnabled} />
</div>

{#if entity.ipBoundEnabled == true}
	<div
		class="mt-2 text-xs text-orange-500 underline cursor-pointer"
		on:click={() => (entity.ip = null)}
	>
		Reset IP address
	</div>
{/if}
