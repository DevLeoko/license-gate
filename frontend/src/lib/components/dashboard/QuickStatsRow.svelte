<script lang="ts">
	import { onMount } from 'svelte'
	import { trpc, type QuickStats } from '../../trpcClient'
	import { formatDateRelative } from '../../utils/formatting'
	import QuickStatsBox from './QuickStatsBox.svelte'

	let stats: QuickStats | null = null

	onMount(async () => {
		stats = await trpc.logs.quickStats.query()
	})

	$: lastSuccessfulCheck = stats ? formatDateRelative(stats.lastSuccessfulCheck) : undefined
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<QuickStatsBox icon="key" title="Active licenses" value={stats?.activeLicenses} />

	<div class="bg-gray-300 w-[1px] self-stretch hidden xl:block">&nbsp;</div>

	<QuickStatsBox
		icon="check_circle"
		title="Successful checks (last 7 days)"
		value={stats?.successfulChecksLast7Days}
		diffValue={stats?.successfulCheckPrevious7Days}
	/>

	<div class="bg-gray-300 w-[1px] self-stretch hidden xl:block">&nbsp;</div>

	<QuickStatsBox
		icon="error_outline"
		title="Failed checks (last 7 days)"
		value={stats?.failedChecksLast7Days}
		diffValue={stats?.failedCheckPrevious7Days}
	/>

	<div class="bg-gray-300 w-[1px] self-stretch hidden xl:block">&nbsp;</div>

	<QuickStatsBox icon="access_time" title="Last check" value={lastSuccessfulCheck} />
</div>
