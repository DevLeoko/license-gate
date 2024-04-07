<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { cloneDeep } from 'lodash'
	import Button from '../../../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../../../lib/components/basics/Skeleton.svelte'
	import LicenseEditor from '../../../../../lib/components/editors/license-editor/LicenseEditor.svelte'
	import { logSuccess } from '../../../../../lib/stores/alerts'
	import { trpc, type CreateLicense } from '../../../../../lib/trpcClient'

	const id = Number.parseInt($page.params.id)

	let license: null | (CreateLicense & { id: number }) = null

	trpc.license.read.query({ id }).then((licenseData) => {
		license = cloneDeep(licenseData)
	})

	let loadingUpdate = false
	async function onSave() {
		if (!license) return

		await trpc.license.update.mutate(license).finally(() => {
			loadingUpdate = false
		})
		logSuccess('License saved')
		goto(`/licenses?preview=${id}`)
	}
</script>

<PageTitle title="Edit license" backLink="/licenses">
	<Button on:click={onSave} loading={loadingUpdate}>
		<span class="mr-1 material-icons">check</span>
		Save
	</Button>
</PageTitle>

{#if license != null}
	<LicenseEditor bind:entity={license} />
{:else}
	<Skeleton class="h-16" />
{/if}
