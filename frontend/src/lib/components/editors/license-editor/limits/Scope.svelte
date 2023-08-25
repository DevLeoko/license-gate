<script lang="ts">
	import type { CreateLicense } from '../../../../trpcClient'
	import Labeled from '../../../basics/Labeled.svelte'

	export let entity: CreateLicense
</script>

<Labeled label="Scope string" class="w-40">
	<input type="text" bind:value={entity.licenseScope} />
</Labeled>

<p class="mt-2 text-xs text-gray-600">
	When a request is made to verify a license, the license scope is compared to the scope string of
	the request. Only if the scopes match, the license is considered valid. If you have multiple
	software products, you can use the scope string to restrict a license to a specific product.<br />
	Leave empty to allow all scopes.
</p>
