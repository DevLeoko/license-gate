<script lang="ts">
	import { goto } from '$app/navigation'
	import { createEventDispatcher } from 'svelte'
	import { notifyLicenseRemoved } from '../../controller/license'
	import { logSuccess } from '../../stores/alerts'
	import { trpc, type ListLicense } from '../../trpcClient'
	import CardActionButton from '../basics/CardActionButton.svelte'
	import ConfirmationCardTrigger from '../basics/ConfirmationCardTrigger.svelte'

	export let license: ListLicense

	const dispatchEvent = createEventDispatcher<{ exit: void; deleted: void }>()

	let loadingDelete = false
	let loadingEdit = false

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
		await trpc.license.update
			.mutate({
				id: license.id,
				active: !license.active,
			})
			.finally(() => {
				loadingEdit = false
			})
		license.active = !license.active
		logSuccess(`License ${!license.active ? 'deactivated' : 'activated'}`)
	}
</script>

<div class="flex flex-col items-stretch space-y-1 text-sm text-left floating-actions">
	<CardActionButton icon="edit" on:click={onEdit}>Edit</CardActionButton>
	<ConfirmationCardTrigger loading={loadingDelete} on:confirm={onDelete}>
		<CardActionButton icon="delete_outline">Delete</CardActionButton>
	</ConfirmationCardTrigger>
	<CardActionButton
		icon={license.active ? 'toggle_on' : 'toggle_off'}
		on:click={onToggleActive}
		loading={loadingEdit}
	>
		{license.active ? 'Deactivate' : 'Activate'}
	</CardActionButton>
</div>
