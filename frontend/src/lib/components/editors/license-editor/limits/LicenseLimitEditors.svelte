<script lang="ts">
	import type { CreateLicense } from '../../../../trpcClient'
	import Collapsable from '../../../basics/Collapsable.svelte'
	import OnOffChip from '../OnOffChip.svelte'
	import Expiration from './Expiration.svelte'
	import IpLimit from './IpLimit.svelte'
	import RateLimit from './RateLimit.svelte'
	import Scope from './Scope.svelte'

	export let entity: CreateLicense

	$: LIMITS = [
		{
			name: 'IP Limit',
			description:
				'You can limit the number of IP addresses that can be used to verify this license.',
			component: IpLimit,
			active: entity.ipLimit !== null,
		},

		{
			name: 'Rate Limit',
			description:
				'You can limit the number of times this license can be verified in a given time period.',
			component: RateLimit,
			active: entity.replenishAmount !== null,
		},

		{
			name: 'Expiration',
			description:
				'You can set an expiration date for this license. After this date, the license will no longer be valid.',
			component: Expiration,
			active: entity.expirationDate !== null,
		},

		{
			name: 'License Scope',
			description:
				'You can limit this license to only work for a specific scope (e.g. software name) that has to be provided when verifying the license.',
			component: Scope,
			active: entity.licenseScope !== null,
		},
	]
</script>

{#each LIMITS as limit (limit.name)}
	<Collapsable class="bg-white border">
		<svelte:fragment slot="label">
			<h3 class="flex items-center font-medium">
				{limit.name}
				<OnOffChip class="ml-2" active={limit.active} />
			</h3>

			<p>{limit.description}</p>
		</svelte:fragment>
		{#if limit.component}
			<svelte:component this={limit.component} bind:entity />
		{/if}
	</Collapsable>
{/each}
