<script lang="ts">
	import { page } from '$app/stores'
	import { persisted } from 'svelte-persisted-store'
	import BasicModal from '../../../lib/components/basics/BasicModal.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import SidePopup from '../../../lib/components/basics/SidePopup.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import FetchingLicenseTable from '../../../lib/components/license/FetchingLicenseTable.svelte'
	import LicensePreview from '../../../lib/components/license/LicensePreview.svelte'
	import LicenseInstructions from '../../../lib/components/license/instructions/LicenseInstructions.svelte'
	import { trpc, type ReadLicense } from '../../../lib/trpcClient'

	let showInstructionsOnCreate = persisted('showInstructionsOnCreate', true)
	let licenseInstructions = false

	let previewLicenseId: number | null = null
	if ($page.url.searchParams.has('preview')) {
		previewLicenseId = Number.parseInt($page.url.searchParams.get('preview')!)
		licenseInstructions = $page.url.searchParams.has('instructions') && $showInstructionsOnCreate
	}

	function closePreview() {
		previewLicenseId = null
	}

	let previewLicense: ReadLicense | null = null

	$: {
		if (previewLicenseId != null) {
			trpc.license.read.query({ id: previewLicenseId }).then((res) => {
				if (res.id !== previewLicenseId) return
				previewLicense = res
			})
		} else {
			previewLicense = null
		}
	}
</script>

<PageTitle title="Licenses">
	<Button href="/licenses/new">
		<span class="mr-1 material-icons">add</span>
		New license
	</Button>
</PageTitle>

<FetchingLicenseTable bind:previewLicenseId />

{#if previewLicenseId != null}
	<SidePopup on:exit={closePreview} class="w-[600px]">
		{#if !previewLicense}
			<Skeleton class="w-full h-48" />
		{:else}
			<LicensePreview bind:license={previewLicense} on:exit={closePreview} />

			<div class="flex justify-center mt-8">
				<Button text on:click={() => (licenseInstructions = true)} class="">
					<span class="mr-1 text-xl material-icons-outlined">integration_instructions</span>
					See how to integrate
				</Button>
			</div>

			{#if licenseInstructions}
				<BasicModal class="!bg-gray-50" on:exit={() => (licenseInstructions = false)}>
					<LicenseInstructions
						license={previewLicense.licenseKey}
						scope={previewLicense.licenseScope ?? undefined}
					/>

					<svelte:fragment slot="action">
						<div class="flex items-center gap-2 mr-auto text-gray-500">
							<input
								id="showInstructionsOnCreate"
								class="opacity-70"
								type="checkbox"
								bind:checked={$showInstructionsOnCreate}
							/>
							<label for="showInstructionsOnCreate" class="text-sm">
								Show these instructions when creating a new license
							</label>
						</div>
						<Button gray text on:click={() => (licenseInstructions = false)}>Close</Button>
					</svelte:fragment>
				</BasicModal>
			{/if}
		{/if}
	</SidePopup>
{/if}
