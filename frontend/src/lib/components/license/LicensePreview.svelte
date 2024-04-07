<script lang="ts">
	import { goto } from '$app/navigation'
	import { createEventDispatcher, onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import { notifyLicenseRemoved, syncLicense } from '../../controller/license'
	import { logSuccess } from '../../stores/alerts'
	import { trpc, type ReadLicense } from '../../trpcClient'
	import Button from '../basics/Button.svelte'
	import ConfirmationCardTrigger from '../basics/ConfirmationCardTrigger.svelte'
	import CopyText from '../basics/CopyText.svelte'
	import Labeled from '../basics/Labeled.svelte'
	import PageTitle from '../basics/PageTitle.svelte'
	import LicenseLimitInfo from './LicenseLimitInfo.svelte'
	import LicenseStatusChip from './LicenseStatusChip.svelte'

	export let license: ReadLicense

	const licenseStore = writable(license)

	onMount(() => {
		return syncLicense(licenseStore, ['active'], () => dispatchEvent('exit'))
	})

	$: {
		licenseStore.set(license)
	}

	$: {
		license = $licenseStore
	}

	const dispatchEvent = createEventDispatcher<{ exit: void; deleted: void }>()

	let loadingDelete = false

	function onEdit() {
		goto(`/licenses/${license.id}/edit`)
	}

	async function onDelete() {
		loadingDelete = true
		await trpc.license.delete.mutate({ id: license.id }).finally(() => {
			loadingDelete = false
		})
		dispatchEvent('deleted')
		notifyLicenseRemoved(license.id)
		logSuccess('License deleted')
	}

	async function onToggleActive() {
		await trpc.license.update.mutate({
			id: license.id,
			active: !license.active,
		})
		license.active = !license.active
		logSuccess(`License ${!license.active ? 'deactivated' : 'activated'}`)
	}
</script>

<PageTitle title="License" backAction={() => dispatchEvent('exit')} closeIcon>
	<LicenseStatusChip {license} />
</PageTitle>

<h2
	class="flex items-center justify-between w-full px-4 py-2 text-xl tracking-widest bg-gray-100 rounded-md"
>
	{license.licenseKey}
	<CopyText class="text-xl" text={license.licenseKey} />
</h2>

<div class="grid w-full grid-cols-1 gap-4 my-8 sm:grid-cols-3">
	<Button on:click={onEdit}>
		Edit
		<span class="absolute text-base material-icons right-2">edit</span>
	</Button>

	<Button on:click={onToggleActive} gray outlined>
		{license.active ? 'Deactivate' : 'Activate'}
		<span class="absolute text-base material-icons right-2">
			{license.active ? 'toggle_on' : 'toggle_off'}
		</span>
	</Button>

	<ConfirmationCardTrigger loading={loadingDelete} on:confirm={onDelete}>
		<Button class="w-full" red outlined>
			Delete
			<span class="absolute text-base material-icons right-2">delete</span>
		</Button>
	</ConfirmationCardTrigger>
</div>

{#if license.name || license.notes}
	<h3 class="mb-2 pageSubTitle">Details</h3>
	<div class="flex flex-col gap-2 mb-8">
		{#if license.name}
			<Labeled label="Name">
				<h4 class="text-lg leading-tight">{license.name}</h4>
			</Labeled>
		{/if}

		{#if license.notes}
			<Labeled label="Notes">
				<p class="leading-tight whitespace-pre-wrap">{license.notes}</p>
			</Labeled>
		{/if}
	</div>
{/if}

<h3 class="mb-2 pageSubTitle">Limits</h3>
<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
	<LicenseLimitInfo {license} />
</div>

<style>
</style>
