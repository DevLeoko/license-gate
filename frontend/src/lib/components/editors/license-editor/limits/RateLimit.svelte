<script lang="ts">
	import type { CreateLicense } from '../../../../trpcClient'
	import Labeled from '../../../basics/Labeled.svelte'

	export let entity: CreateLicense

	function onReplenishAmountChange(amount: number | null) {
		if (amount != null) {
			entity.validationLimit = amount * 3
			entity.validationPoints = entity.validationLimit

			if (entity.replenishInterval == null) entity.replenishInterval = 'TEN_SECONDS'
		} else {
			entity.validationLimit = null
			entity.replenishInterval = null
			entity.validationPoints = null
		}
	}

	$: localReplenishAmount = entity.replenishAmount

	$: onReplenishAmountChange(localReplenishAmount)
</script>

<div class="flex flex-wrap items-center font-medium">
	This license can be verified <input
		type="number"
		class="!w-16 text-right mx-2"
		bind:value={entity.replenishAmount}
	/>
	times per
	<select class="inline-block !w-32 text-center mx-2" bind:value={entity.replenishInterval}>
		<option value="TEN_SECONDS">10 seconds</option>
		<option value="MINUTE">minute</option>
		<option value="HOUR">hour</option>
		<option value="DAY">day</option>
	</select>
</div>

<Labeled label="Burst Limit" class="w-40 mt-2">
	<input type="number" bind:value={entity.validationLimit} />
</Labeled>

<p class="mt-2 text-xs text-gray-600">
	The burst limit allows to temporarily exceed the limit. <br />
	(Recommended: 3x the normal limit)
</p>
