<script lang="ts">
	import { onMount } from 'svelte'
	import Chip from '../../../lib/components/basics/Chip.svelte'
	import Filter from '../../../lib/components/basics/Filter.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import { trpc, type ListLog, type ValidationResult } from '../../../lib/trpcClient'
	import Button from '../basics/Button.svelte'
	import Skeleton from '../basics/Skeleton.svelte'
	import LogsTable from './LogsTable.svelte'

	const PAGE_SIZE = 25

	let logs: ListLog[] = []
	let loading = false
	let hasMoreToLoad = true

	let resultFilter: ValidationResult[] = []

	// TODO: It would be cool to have auto fetching in the background for newer logs (using after cursor in query)
	onMount(() => {
		fetchLogs(true)
	})

	function fetchLogs(reset: boolean = false) {
		loading = true
		trpc.logs.list
			.query({
				filter: {
					result: resultFilter.length ? resultFilter : undefined,
				},
				size: PAGE_SIZE,
				before: reset ? undefined : logs[logs.length - 1].id,
			})
			.then((res) => {
				logs = reset ? res : [...logs, ...res]
				hasMoreToLoad = res.length == PAGE_SIZE
			})
			.finally(() => {
				loading = false
			})
	}

	function loadMore() {
		if (loading) return

		fetchLogs()
	}

	$: {
		resultFilter
		fetchLogs(true)
	}

	const RESULT_OPTIONS = [
		'VALID',
		'NOT_FOUND',
		'NOT_ACTIVE',
		'EXPIRED',
		'LICENSE_SCOPE_FAILED',
		'IP_LIMIT_EXCEEDED',
		'RATE_LIMIT_EXCEEDED',
	] satisfies ValidationResult[]
</script>

<PageTitle title="Logs" />

<div class="flex items-center gap-2">
	<span class="text-sm font-medium text-gray-500 uppercase">Filter:</span>

	<!-- Result type filter -->
	<Filter
		title="Result type"
		bind:selected={resultFilter}
		options={RESULT_OPTIONS.map((value) => ({ value }))}
	>
		<svelte:fragment slot="selected" let:value>
			<Chip snug color={value == 'VALID' ? 'green-500' : 'red-500'}>
				{value}
			</Chip>
		</svelte:fragment>
		<svelte:fragment slot="option" let:option>
			<Chip snug class="my-1" color={option.value == 'VALID' ? 'green-500' : 'red-500'}>
				{option.value}
			</Chip>
		</svelte:fragment>
	</Filter>
</div>

<LogsTable {logs} />

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
