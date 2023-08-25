<script lang="ts">
	import type { CreateLicense } from '../../../../trpcClient'
	import Labeled from '../../../basics/Labeled.svelte'

	export let entity: CreateLicense
</script>

<Labeled label="Number of IPs per 12h" class="w-40">
	<input type="number" bind:value={entity.ipLimit} />
</Labeled>
<p class="mt-2 text-xs text-gray-600">
	This is the number of different IP addresses that can be used to verify this license in a 12 hour
	period. Keep in mind that IP addresses can change frequently, especially on mobile devices. This
	means that legitimate users might be blocked from using your software if you set this limit too
	low. <br />(Recommended: 3x the number of users you expect to use your software)
</p>
