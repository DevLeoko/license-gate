<script lang="ts">
	import type { ListLicense } from '../../trpcClient'
	import LicenseRow from './LicenseRow.svelte'

	export let licenses: ListLicense[]
	export let previewLicenseId: number | null = null
</script>

<div class="hidden py-2 overflow-x-auto md:block">
	<table class="w-full">
		<tr class="text-left font-medium contents [&>*]:px-2">
			<th>License Key</th>
			<th>Name</th>
			<th>Created</th>
			<th>Expires</th>
			<th>Verifies last 7 days</th>
			<th>Last verify</th>
			<th />
			<th />
		</tr>
		{#each licenses as license (license.id)}
			<LicenseRow
				bind:license
				on:click={() => (previewLicenseId = license.id)}
				class={previewLicenseId == license.id ? 'bg-blue-100 hover:bg-blue-100' : ''}
			/>
		{/each}
	</table>
</div>

<div class="flex flex-col gap-2 md:hidden">
	{#each licenses as license, index (license.id)}
		<LicenseRow
			bind:license
			class="{index != 0 ? 'border-t border-gray-300' : ''} py-2"
			on:click={() => (previewLicenseId = license.id)}
		/>
	{/each}
</div>
