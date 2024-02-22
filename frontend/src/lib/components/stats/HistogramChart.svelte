<script lang="ts">
	import { trpc, type HistogramData } from '../../trpcClient'
	import Chart from './Chart.svelte'

	export let intervalType: 'minute' | 'hour' | 'day' | 'month'
	export let intervalCount: number
	export let licenseId: number | undefined = undefined

	let data: HistogramData = []

	$: {
		trpc.logs.histogram
			.query({
				interval: intervalType,
				intervalCount,
				licenseId,
			})
			.then((res) => {
				data = res.histogram
			})
	}

	$: labels = data.map((d) => formatLabel(intervalType, d.date))

	function formatLabel(intervalType: 'minute' | 'hour' | 'day' | 'month', value: Date) {
		if (intervalType == 'minute' || intervalType == 'hour') {
			return value.toLocaleTimeString(undefined, {
				hour: '2-digit',
				minute: '2-digit',
			})
		} else if (intervalType == 'day') {
			return value.toLocaleDateString(undefined, {
				timeZone: 'UTC',
				day: '2-digit',
				month: '2-digit',
			})
		} else if (intervalType == 'month') {
			return value.toLocaleDateString(undefined, {
				timeZone: 'UTC',
				month: 'short',
				year: '2-digit',
			})
		}

		throw new Error(`Unknown interval type: ${intervalType}`)
	}
</script>

<Chart
	{labels}
	data={[
		{
			color: '#ff0000aa',
			values: data.map((d) => d.invalid),
		},
		{
			color: '#16a34a',
			values: data.map((d) => d.valid),
		},
	]}
>
	<svelte:fragment slot="tooltip" let:label let:values>
		<div class="flex flex-col">
			<h2 class="font-semibold text-gray-900">{label}</h2>
			<div class="flex items-center gap-2 text-sm text-gray-500">
				<span>
					{values[1]}
					valid requests
				</span>
				<div class="w-2 h-2 ml-auto rounded-full" style="background-color: #16a34a" />
			</div>

			<div class="flex items-center gap-2 text-sm text-gray-500">
				<span>
					{values[0]}
					invalid requests
				</span>
				<div class="w-2 h-2 ml-auto rounded-full" style="background-color: #ff0000aa" />
			</div>
		</div>
	</svelte:fragment>
</Chart>
