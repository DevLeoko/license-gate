<script lang="ts">
	import { goto } from '$app/navigation'
	import { createEventDispatcher } from 'svelte'
	import { notifyDeviceRemoved } from '../../controller/device'
	import { logSuccess } from '../../stores/alerts'
	import { trpc, type ListDevice } from '../../trpcClient'
	import CardActionButton from '../basics/CardActionButton.svelte'
	import ConfirmationCardTrigger from '../basics/ConfirmationCardTrigger.svelte'

	export let device: ListDevice

	const dispatchEvent = createEventDispatcher<{ exit: void; deleted: void }>()

	let loadingDelete = false
	let loadingEdit = false

	function onEdit() {
		goto(`/devices/${device.deviceId}/edit`)
	}

	async function onDelete() {
		loadingDelete = true
		await trpc.device.delete.mutate({ deviceId: device.deviceId }).finally(() => {
			loadingDelete = false
		})
		dispatchEvent('deleted')
		notifyDeviceRemoved(device.deviceId)
		logSuccess('Device deleted')
	}

	async function onToggleActive() {
		await trpc.device.update
			.mutate({
				createdAt: device.createdAt,
				deviceId: device.deviceId,
				isActive: !device.isActive,
			})
			.finally(() => {
				loadingEdit = false
			})
		device.isActive = !device.isActive
		logSuccess(`Device ${!device.isActive ? 'deactivated' : 'activated'}`)
	}
</script>

<div class="flex flex-col items-stretch space-y-1 text-sm text-left floating-actions">
	<CardActionButton icon="edit" on:click={onEdit}>Edit</CardActionButton>
	<ConfirmationCardTrigger loading={loadingDelete} on:confirm={onDelete}>
		<CardActionButton icon="delete_outline">Delete</CardActionButton>
	</ConfirmationCardTrigger>
	<CardActionButton
		icon={device.isActive ? 'toggle_on' : 'toggle_off'}
		on:click={onToggleActive}
		loading={loadingEdit}
	>
		{device.isActive ? 'Deactivate' : 'Activate'}
	</CardActionButton>
</div>
