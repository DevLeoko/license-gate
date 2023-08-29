<script lang="ts">
	import { goto } from '$app/navigation'
	import { createLicenseDeleteMutation } from '../../controller/query/license'
	import { logSuccess } from '../../stores/alerts'
	import type { ListLicense } from '../../trpcClient'
	import CardActionButton from '../basics/CardActionButton.svelte'
	import ConfirmationCardTrigger from '../basics/ConfirmationCardTrigger.svelte'

	export let license: ListLicense

	const deleteMutation = createLicenseDeleteMutation()

	function onEdit() {
		goto(`/licenses/${license.id}/edit`)
	}

	async function onDelete() {
		await $deleteMutation.mutateAsync(license.id)
		logSuccess('License deleted')
	}
</script>

<div class="flex flex-col items-stretch space-y-1 text-sm text-left floating-actions">
	<CardActionButton icon="edit" on:click={onEdit}>Edit</CardActionButton>
	<ConfirmationCardTrigger loading={$deleteMutation.isLoading} on:confirm={onDelete}>
		<CardActionButton icon="delete_outline">Delete</CardActionButton>
	</ConfirmationCardTrigger>
</div>
