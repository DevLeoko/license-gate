<script lang="ts">
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import { trpc, type ListLicense } from '../../../lib/trpcClient'
	import { syncLicenses } from '../../controller/license'
	import Button from '../basics/Button.svelte'
	import Skeleton from '../basics/Skeleton.svelte'
	import LicenseTable from './LicenseTable.svelte'

	const PAGE_SIZE = 25

	export let previewLicenseId: number | null = null

	let licenses: ListLicense[] = []
	let loading = false
	let hasMoreToLoad = true

	const licensesStore = writable(licenses)

	onMount(() => {
		fetchLogs(true)

		return syncLicenses(licensesStore, ['active'])
	})

	$: {
		licensesStore.set(licenses)
	}

	$: {
		licenses = $licensesStore
	}

	function fetchLogs(reset: boolean = false) {
		loading = true
		trpc.license.list
			.query({
				take: PAGE_SIZE,
				skip: reset ? 0 : licenses.length,
			})
			.then((res) => {
				licenses = reset ? res.licenses : [...licenses, ...res.licenses]
				hasMoreToLoad = res.count > licenses.length
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

<LicenseTable bind:licenses bind:previewLicenseId />

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
