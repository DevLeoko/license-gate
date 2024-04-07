<script lang="ts">
	import { onMount } from 'svelte'
	import { trpc, type ListLicense } from '../../../lib/trpcClient'
	import Button from '../basics/Button.svelte'
	import Skeleton from '../basics/Skeleton.svelte'
	import LicenseTable from './LicenseTable.svelte'

	const PAGE_SIZE = 25

	export let previewLicenseId: number | null = null

	let licenses: ListLicense[] = []
	let loading = false
	let hasMoreToLoad = true

	onMount(() => {
		fetchLogs(true)
	})

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
