<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../../lib/components/basics/PageTitle.svelte'
	import LicenseEditor from '../../../../lib/components/editors/license-editor/LicenseEditor.svelte'
	import { createLicenseCreateMutation } from '../../../../lib/controller/query/license'
	import { logSuccess } from '../../../../lib/stores/alerts'
	import type { CreateLicense } from '../../../../lib/trpcClient'

	let license: CreateLicense = {
		name: '',
		notes: '',

		active: true,

		ipLimit: null,
		licenseScope: null,
		expirationDate: null,

		validationPoints: null,
		validationLimit: null,
		replenishAmount: null,
		replenishInterval: null,

		// UUIDv4
		licenseKey: self.crypto.randomUUID(),
	}

	const createMutation = createLicenseCreateMutation()

	async function onSave() {
		const licenseRes = await $createMutation.mutateAsync(license)

		logSuccess('License created')
		goto(`/licenses?preview=${licenseRes.id}`)
	}
</script>

<PageTitle title="Create new license" backLink="/licenses">
	<Button on:click={onSave} loading={$createMutation.isLoading}>
		<span class="mr-1 material-icons">check</span>
		Save
	</Button>
</PageTitle>

<LicenseEditor bind:entity={license} />
