<script lang="ts">
	import type { CreateLicense } from '../../../trpcClient'
	import Labeled from '../../basics/Labeled.svelte'
	import LicenseLimitEditors from './limits/LicenseLimitEditors.svelte'

	export let entity: CreateLicense

	export let inputError: string | null = null

	$: {
		if (!entity.licenseKey) {
			inputError = 'License key can not be empty'
		}
	}
</script>

<div class="flex flex-col gap-12 xs:w-1/2">
	<div>
		<h2 class="pageSubTitle">License Key</h2>
		<input
			class="w-full mt-1 text-2xl tracking-widest border-b-2 border-b-gray-400 focus:border-b-blue-400 plain"
			type="text"
			bind:value={entity.licenseKey}
		/>
	</div>

	<div class="flex flex-col gap-2">
		<div>
			<h2 class="pageSubTitle">Your Notes</h2>
			<p>
				These notes are only visible to you. You can use them to keep track of important information
				about this license.
			</p>
		</div>
		<Labeled label="Name">
			<input type="text" bind:value={entity.name} />
		</Labeled>

		<Labeled label="Notes">
			<textarea bind:value={entity.notes} />
		</Labeled>
	</div>

	<div class="flex flex-col gap-4">
		<h2 class="pageSubTitle">Limit License</h2>

		<LicenseLimitEditors bind:entity />
	</div>
</div>
