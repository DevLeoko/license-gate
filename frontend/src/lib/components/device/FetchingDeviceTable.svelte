<script lang="ts">
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import { trpc, type ListDevice } from '../../../lib/trpcClient'
	import { syncDevices } from '../../controller/device'
	import Button from '../basics/Button.svelte'
	import Skeleton from '../basics/Skeleton.svelte'
	import DeviceTable from './DeviceTable.svelte'

	const PAGE_SIZE = 25

	export let previewDeviceId: number | null = null

	let devices: ListDevice[] = []
	let loading = false
	let hasMoreToLoad = true

	const devicesStore = writable(devices)

	onMount(() => {
		fetchLogs(true)

		return syncDevices(devicesStore, ['active'])
	})

	$: {
		devicesStore.set(devices)
	}

	$: {
		devices = $devicesStore
	}

	function fetchLogs(reset: boolean = false) {
		loading = true
		trpc.device.list
				.query({
					take: PAGE_SIZE,
					skip: reset ? 0 : devices.length,
				})
				.then((res) => {
					devices = reset ? res.devices : [...devices, ...res.devices]
					hasMoreToLoad = res.count > devices.length
				})
				.finally(() => {
					loading = false
				})
	}

	function loadMore() {
		if (loading) return

		fetchLogs()
	}
</script>

<DeviceTable bind:devices bind:previewDeviceId />

{#if loading}
	<div class="flex flex-col gap-2">
		{#each Array.from({ length: 3 }) as _}
			<Skeleton class="w-full h-6" />
		{/each}
	</div>
{/if}

{#if hasMoreToLoad && !loading}
	<Button text on:click={loadMore}>Load more</Button>
{/if}
