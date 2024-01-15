<script lang="ts">
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import SmallSelector from '../../../lib/components/basics/SmallSelector.svelte'
	import QuickStatsRow from '../../../lib/components/dashboard/QuickStatsRow.svelte'
	import HistogramChart from '../../../lib/components/stats/HistogramChart.svelte'

	const INTERVAL_TYPES = [
		{
			label: 'last 30 minutes',
			type: 'minute',
			count: 30,
		},
		{
			label: 'last 24 hours',
			type: 'hour',
			count: 24,
		},
		{
			label: 'last 7 days',
			type: 'day',
			count: 7,
		},
		{
			label: 'last 30 days',
			type: 'day',
			count: 30,
		},
		{
			label: 'last 12 months',
			type: 'month',
			count: 12,
		},
	] as {
		label: string
		type: 'minute' | 'hour' | 'day' | 'month'
		count: number
	}[]

	let selectedIntervalType: (typeof INTERVAL_TYPES)[number] = INTERVAL_TYPES[1]
</script>

<PageTitle title="Dashboard" />

<div class="flex flex-col min-w-0">
	<QuickStatsRow />
	<hr class="my-4" />
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-900">
			License requests ({selectedIntervalType.label})
		</h2>

		<SmallSelector bind:value={selectedIntervalType} items={INTERVAL_TYPES}>
			<svelte:fragment slot="element" let:value>
				<span class="text-sm">
					Interval: <b>{value?.label ?? 'select'}</b>
				</span>
			</svelte:fragment>
			<svelte:fragment slot="item" let:item>
				{item.label}
			</svelte:fragment>
		</SmallSelector>
	</div>
	<HistogramChart
		intervalType={selectedIntervalType.type}
		intervalCount={selectedIntervalType.count}
	/>
</div>
