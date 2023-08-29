<script lang="ts">
	import type { CreateLicense } from '../../../../trpcClient'
	import DateInput from '../../../basics/DateInput.svelte'
	import Labeled from '../../../basics/Labeled.svelte'

	export let entity: CreateLicense
</script>

<Labeled label="Expiration Date" class="w-40">
	<DateInput bind:date={entity.expirationDate} />
</Labeled>

{#if entity.expirationDate}
	<div
		class="mt-2 text-xs text-orange-500 underline cursor-pointer"
		on:click={() => (entity.expirationDate = null)}
	>
		Remove expiration date
	</div>
{/if}
