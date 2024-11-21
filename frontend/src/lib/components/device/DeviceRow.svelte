<script lang="ts">
	import { isMdOrLarger } from '../../stores/screen-size'
	import type { ListDevice } from '../../trpcClient'
	import FloatingCardTrigger from '../basics/FloatingCardTrigger.svelte'
	import DeviceActionCard from './DeviceActionCard.svelte'
	import DeviceStatusChip from './DeviceStatusChip.svelte'

	export let device: ListDevice

	let className = ''

	export { className as class }
</script>

{#if $isMdOrLarger}
	<tr
		class="my-row [&>*]:px-2 [&>*]:py-1 cursor-pointer border-b last:border-b-0 hover:bg-slate-100 {className}"
		on:click
	>
		<td class="rounded-l-sm">{device.deviceId}</td>
		<td>{device.licenseId}</td>
		<td>{device.logs?.length || '0'}</td>
		<td class="rounded-r-sm">{device.logs?.[0]?.timestamp?.toLocaleDateString() || ''}</td>
		<td>{device.createdAt.toLocaleDateString()}</td>
		<td>
			<DeviceStatusChip {device} />
		</td>
		<td class="relative text-right">
			<div on:click|stopPropagation={() => {}}>
				<FloatingCardTrigger>
					<svelte:fragment slot="trigger">
						<span class="p-2 -m-2 text-base material-icons hover:text-blue-500">more_vert</span>
					</svelte:fragment>
					<DeviceActionCard bind:device on:deleted />
				</FloatingCardTrigger>
			</div>
		</td>
	</tr>
{:else}
	<div class="flex items-end justify-between {className} leading-snug" on:click>
		<div class="flex flex-col">
			<b class="font-medium">
				{device.deviceKey}
			</b>
			<span class="text-sm">
				{device.name}
			</span>
			<span class="text-sm">
				{device.createdAt.toLocaleDateString()}
			</span>
		</div>

		<div class="flex flex-col items-end self-stretch justify-between">
			<span class="block font-medium">
				{device.expirationDate?.toLocaleDateString() || 'Never Expires'}
			</span>
			<DeviceStatusChip class="mt-auto" {device} />
		</div>
	</div>
{/if}
