<script lang="ts">
	import { goto } from '$app/navigation'
	import {
		createLicenseDeleteMutation,
		createLicenseUpdateMutation,
	} from '../../controller/query/license'
	import { logSuccess } from '../../stores/alerts'
	import type { ListLicense } from '../../trpcClient'
	import CardActionButton from '../basics/CardActionButton.svelte'
	import ConfirmationCardTrigger from '../basics/ConfirmationCardTrigger.svelte'

	export let license: ListLicense

	const deleteMutation = createLicenseDeleteMutation()
	const updateMutation = createLicenseUpdateMutation()

	function onEdit() {
		goto(`/licenses/${license.id}/edit`)
	}

	async function onDelete() {
		await $deleteMutation.mutateAsync(license.id)
		logSuccess('License deleted')
	}

	async function onToggleActive() {
		await $updateMutation.mutateAsync({
			id: license.id,
			active: !license.active,
		})
		logSuccess(`License ${license.active ? 'deactivated' : 'activated'}`)
	}
</script>

<div class="flex flex-col items-stretch space-y-1 text-sm text-left floating-actions">
	<CardActionButton icon="edit" on:click={onEdit}>Edit</CardActionButton>
	<ConfirmationCardTrigger loading={$deleteMutation.isLoading} on:confirm={onDelete}>
		<CardActionButton icon="delete_outline">Delete</CardActionButton>
	</ConfirmationCardTrigger>
	<CardActionButton
		icon={license.active ? 'toggle_on' : 'toggle_off'}
		on:click={onToggleActive}
		loading={$updateMutation.isLoading}
	>
		{license.active ? 'Deactivate' : 'Activate'}
	</CardActionButton>
</div>
