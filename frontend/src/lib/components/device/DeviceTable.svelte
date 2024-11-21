<script lang="ts">
	import type { ListDevice } from '../../trpcClient'
	import DeviceRow from './DeviceRow.svelte'

	export let devices: ListDevice[]
	export let previewDeviceId: number | null = null
</script>

<div class="hidden py-2 overflow-x-auto md:block">
	<table class="w-full">
		<tr class="text-left font-medium contents [&>*]:px-2">
			<th>Device ID</th>
			<th>License ID</th>
			<th>Verifies last 7 days</th>
			<th>Last verify</th>
			<th>Status</th>
			<th>Created</th>
		</tr>
		{#each devices as device (device.id)}
			<DeviceRow
					bind:device
					on:click={() => (previewDeviceId = device.id)}
					class={previewDeviceId == device.id ? 'bg-blue-100 hover:bg-blue-100' : ''}
			/>
		{/each}
	</table>
</div>

<div class="flex flex-col gap-2 md:hidden">
	{#each devices as device, index (device.id)}
		<DeviceRow
				bind:device
				class="{index != 0 ? 'border-t border-gray-300' : ''} py-2"
				on:click={() => (previewDeviceId = device.id)}
		/>
	{/each}
</div>
