<script lang="ts">
	import { page } from '$app/stores'
	import BasicModal from '../../../lib/components/basics/BasicModal.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import SidePopup from '../../../lib/components/basics/SidePopup.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import LicensePreview from '../../../lib/components/license/LicensePreview.svelte'
	import LicenseRow from '../../../lib/components/license/LicenseRow.svelte'
	import LicenseInstructions from '../../../lib/components/license/instructions/LicenseInstructions.svelte'
	import {
		createLicenseListQuery,
		createLicenseReadQuery,
	} from '../../../lib/controller/query/license'

	const licenses = createLicenseListQuery(10, 0)

	let licenseInstructions = false

	let previewLicenseId: number | null = null
	$: previewLicense = previewLicenseId != null ? createLicenseReadQuery(previewLicenseId) : null
	if ($page.url.searchParams.has('preview')) {
		previewLicenseId = Number.parseInt($page.url.searchParams.get('preview')!)
		licenseInstructions = $page.url.searchParams.has('instructions')
	}

	function closePreview() {
		previewLicenseId = null
	}
</script>

<PageTitle title="Licenses">
	<Button href="/licenses/new">
		<span class="mr-1 material-icons">add</span>
		New license
	</Button>
</PageTitle>

{#if $licenses.isLoading}
	<Skeleton class="w-24 h-12" />
{:else if $licenses.isError}
	<span>There was an error retrieving the data</span>
{:else if $licenses.data.count === 0}
	<div class="error">No license found</div>
{:else}
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
			{#each $licenses.data.licenses as license (license.id)}
				<LicenseRow
					{license}
					on:click={() => (previewLicenseId = license.id)}
					class={previewLicenseId == license.id ? 'bg-blue-100 hover:bg-blue-100' : ''}
				/>
			{/each}
		</table>
	</div>

	<div class="flex flex-col gap-2 md:hidden">
		{#each $licenses.data.licenses as license, index (license.id)}
			<LicenseRow
				{license}
				class="{index != 0 ? 'border-t border-gray-300' : ''} py-2"
				on:click={() => (previewLicenseId = license.id)}
			/>
		{/each}
	</div>

	{#if previewLicense != null}
		<SidePopup on:exit={closePreview} class="w-[600px]">
			{#if !$previewLicense?.data}
				<Skeleton class="w-full h-48" />
			{:else}
				<LicensePreview license={$previewLicense.data} on:exit={closePreview} />

				<div class="flex justify-center mt-8">
					<Button text on:click={() => (licenseInstructions = true)} class="">
						<span class="mr-1 text-xl material-icons-outlined">integration_instructions</span>
						See how to integrate
					</Button>
				</div>

				{#if licenseInstructions}
					<BasicModal class="!bg-gray-50" on:exit={() => (licenseInstructions = false)}>
						<LicenseInstructions
							license={$previewLicense.data.licenseKey}
							scope={$previewLicense.data.licenseScope ?? undefined}
						/>

						<svelte:fragment slot="action">
							<Button gray text on:click={() => (licenseInstructions = false)}>Close</Button>
						</svelte:fragment>
					</BasicModal>
				{/if}
			{/if}
		</SidePopup>
	{/if}
{/if}
