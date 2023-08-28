<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { cloneDeep } from 'lodash'
	import Button from '../../../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../../../lib/components/basics/Skeleton.svelte'
	import LicenseEditor from '../../../../../lib/components/editors/license-editor/LicenseEditor.svelte'
	import {
		createLicenseUpdateMutation,
		queryLicenseRead,
	} from '../../../../../lib/controller/query/license'
	import { logSuccess } from '../../../../../lib/stores/alerts'
	import type { CreateLicense } from '../../../../../lib/trpcClient'

	const id = Number.parseInt($page.params.id)

	let license: null | (CreateLicense & { id: number }) = null

	queryLicenseRead(id).then((licenseData) => {
		license = cloneDeep(licenseData)
	})

	const updateLicense = createLicenseUpdateMutation()

	async function onSave() {
		if (!license) return

		await $updateLicense.mutateAsync(license)
		logSuccess('License saved')
		goto(`/licenses?preview=${id}`)
	}
</script>

<PageTitle title="Edit license" backLink="/licenses">
	<Button on:click={onSave} loading={$updateLicense.isLoading}>
		<span class="mr-1 material-icons">check</span>
		Save
	</Button>
</PageTitle>

{#if license != null}
	<LicenseEditor bind:entity={license} />
{:else}
	<Skeleton class="h-16" />
{/if}
