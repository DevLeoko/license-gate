<script lang="ts">
	import type { ReadLicense } from '../../trpcClient'
	import { replenishIntervalToString } from '../../utils/replenish-interval-formatter'
	import OnOffChip from '../editors/license-editor/OnOffChip.svelte'

	export let license: ReadLicense

	$: LIMITS = [
		{
			name: 'IP Limit',
			text: `Limited to ${license.ipLimit} IP addresses over 12 hours.`,
			active: license.ipLimit !== null,
		},

		{
			name: 'Rate Limit',
			text: `Limited to ${license.replenishAmount} verifications every ${
				!license.replenishInterval ? '' : replenishIntervalToString(license.replenishInterval)
			} (Burst: ${license.validationLimit}).`,
			active: license.replenishAmount !== null,
		},

		{
			name: 'Expiration',
			text: `Expires on ${license.expirationDate?.toLocaleDateString()}.`,
			active: license.expirationDate !== null,
		},

		{
			name: 'License Scope',
			text: `Limited to scope: ${license.licenseScope}.`,
			active: license.licenseScope !== null,
		},
	]
</script>

{#each LIMITS as limit (limit.name)}
	<div
		class="flex flex-col px-4 py-2 bg-gray-100 border border-gray-200 rounded-sm"
		class:opacity-40={!limit.active}
	>
		<h3 class="flex items-center w-full font-medium">
			{limit.name}
			<OnOffChip class="block ml-auto" active={limit.active} />
		</h3>

		{#if limit.active}
			<p class="text-sm leading-snug text-gray-600">{limit.text}</p>
		{/if}
	</div>
{/each}
