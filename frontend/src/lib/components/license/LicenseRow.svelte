<script lang="ts">
	import { isMdOrLarger } from '../../stores/screen-size'
	import type { ListLicense } from '../../trpcClient'
	import FloatingCardTrigger from '../basics/FloatingCardTrigger.svelte'
	import LicenseActionCard from './LicenseActionCard.svelte'
	import LicenseStatusChip from './LicenseStatusChip.svelte'

	export let license: ListLicense

	let className = ''

	export { className as class }
</script>

{#if $isMdOrLarger}
	<tr
		class="my-row [&>*]:px-2 [&>*]:py-1 cursor-pointer border-b last:border-b-0 hover:bg-slate-100 {className}"
		on:click
	>
		<td class="rounded-l-sm">{license.licenseKey}</td>
		<td>{license.name}</td>
		<td>{license.createdAt.toLocaleDateString()}</td>
		<td>{license.expirationDate?.toLocaleDateString() || ''}</td>
		<td>{license.logs?.length || '0'}</td>
		<td class="rounded-r-sm">{license.logs?.[0]?.timestamp?.toLocaleDateString() || ''}</td>
		<td>
			<LicenseStatusChip {license} />
		</td>
		<td class="relative text-right">
			<div on:click|stopPropagation={() => {}}>
				<FloatingCardTrigger>
					<svelte:fragment slot="trigger">
						<span class="p-2 -m-2 text-base material-icons hover:text-blue-500">more_vert</span>
					</svelte:fragment>
					<LicenseActionCard bind:license on:deleted />
				</FloatingCardTrigger>
			</div>
		</td>
	</tr>
{:else}
	<div class="flex items-end justify-between {className} leading-snug" on:click>
		<div class="flex flex-col">
			<b class="font-medium">
				{license.licenseKey}
			</b>
			<span class="text-sm">
				{license.name}
			</span>
			<span class="text-sm">
				{license.createdAt.toLocaleDateString()}
			</span>
		</div>

		<div class="flex flex-col items-end self-stretch justify-between">
			<span class="block font-medium">
				{license.expirationDate?.toLocaleDateString() || 'Never Expires'}
			</span>
			<LicenseStatusChip class="mt-auto" {license} />
		</div>
	</div>
{/if}
