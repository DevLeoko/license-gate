<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import PageTitle from '../../../../lib/components/basics/PageTitle.svelte'
	import LicenseEditor from '../../../../lib/components/editors/license-editor/LicenseEditor.svelte'
	import { logSuccess } from '../../../../lib/stores/alerts'
	import { trpc, type CreateLicense } from '../../../../lib/trpcClient'

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

	let loadingCreate = false
	async function onSave() {
		const licenseRes = await trpc.license.create.mutate(license).finally(() => {
			loadingCreate = false
		})

		logSuccess('License created')
		goto(`/licenses?preview=${licenseRes.id}&instructions=true`)
	}
</script>

<PageTitle title="Create new license" backLink="/licenses">
	<Button on:click={onSave} loading={loadingCreate}>
		<span class="mr-1 material-icons">check</span>
		Save
	</Button>
</PageTitle>

<LicenseEditor bind:entity={license} />
