<script lang="ts">
	import Chip from '../../../lib/components/basics/Chip.svelte'
	import type { ListLog } from '../../../lib/trpcClient'

	export let logs: ListLog[]
</script>

<div class="py-2 overflow-x-auto">
	<table class="w-full">
		<tr class="text-left font-medium contents [&>*]:px-2">
			<th>Time</th>
			<th>License Key</th>
			<th>Name</th>
			<th>Result</th>
			<th>Metadata</th>
		</tr>
		{#each logs as log (log.id)}
			<tr class="my-tr">
				<td>{log.timestamp.toLocaleDateString()}</td>
				<td>{log.license.licenseKey}</td>
				<td>{log.license.name}</td>
				<td>
					<Chip color={log.result == 'VALID' ? 'green-500' : 'red-500'}>
						{log.result}
					</Chip>
				</td>
				<td>{log.metadata}</td>
			</tr>
		{/each}
	</table>
</div>
