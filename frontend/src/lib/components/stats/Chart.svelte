<script lang="ts">
	import * as d3 from 'd3'
	import { onMount } from 'svelte'
	import FloatingCard from '../basics/FloatingCard.svelte'

	export let labels: string[]
	export let data: {
		color: string
		values: number[]
	}[] = []
	let width = 800
	export let height = 400
	export let marginTop = 20
	export let marginRight = 20
	export let marginBottom = 30
	export let marginLeft = 50

	let container = null as HTMLDivElement | null

	onMount(() => {
		// Register and unregister the resize observer
		const resizeObserver = new ResizeObserver((entries) => {
			const { width: newWidth } = entries[0].contentRect
			width = newWidth
		})
		resizeObserver.observe(container!)

		return () => resizeObserver.disconnect()
	})

	function onChatClick(index: number) {
		if (lastClickedIndex == index) {
			showIndex = null
			lastClickedIndex = null
		} else {
			showIndex = index
			lastClickedIndex = index
		}
	}

	let showIndex: number | null = null
	let lastClickedIndex: number | null = null

	$: x = d3.scaleLinear([0, labels.length - 1], [marginLeft, width - marginRight])
	$: y = d3.scaleLinear(
		[0, d3.max(data.flatMap((d) => d.values)) as number],
		[height - marginBottom, marginTop],
	)
	$: area = d3.area((d, i) => x(i), y(0), y).curve(d3.curveMonotoneX)
	$: line = d3.line((d, i) => x(i), y).curve(d3.curveMonotoneX)

	$: segmentWidth = (width - marginLeft - marginRight) / labels.length

	$: showValues = showIndex == null ? [] : data.map((d) => d.values[showIndex!])

	$: spaceForNLabels = (width - marginLeft - marginRight) / 65
	$: showEveryNthLabel = Math.ceil(labels.length / spaceForNLabels)
</script>

<div class="max-w-full" bind:this={container}>
	<div class="relative">
		<svg {width} {height}>
			<defs>
				<radialGradient id="area-gradient" cx="50%" cy="0%" r="75%" fx="50%" fy="0%">
					<stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15" />
					<stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
				</radialGradient>

				{#each [...data].reverse() as graph, i}
					<radialGradient id="area-gradient-{i}" cx="50%" cy="0%" r="75%" fx="50%" fy="0%">
						<stop offset="0%" stop-color={graph.color} stop-opacity="0.15" />
						<stop offset="100%" stop-color={graph.color} stop-opacity="0" />
					</radialGradient>
				{/each}
			</defs>

			{#each [...data].reverse() as graph, i}
				<path fill="url(#area-gradient-{i})" stroke="none" d={area(graph.values)} />
			{/each}
			{#each [...data].reverse() as graph, i}
				<path
					fill="none"
					stroke={graph.color}
					stroke-width={1.5}
					stroke-dasharray={i == 0 ? 'none' : '4 4'}
					d={line(graph.values)}
				/>
			{/each}

			<!-- Horizontal lines -->
			<g>
				{#each y.ticks(5) as tick}
					<line
						x1={marginLeft}
						x2={width - marginRight}
						y1={y(tick) + 0.25}
						y2={y(tick) + 0.25}
						stroke="#8a8c96"
						stroke-opacity="0.2"
						stroke-width="0.5"
					/>
				{/each}
			</g>

			<g>
				{#each labels as _, i}
					{@const val = data[0].values[i] || 0}
					{#if showIndex == i}
						<!-- Dashed line to bottom -->
						<line
							x1={x(i)}
							x2={x(i)}
							y1={y(val)}
							y2={height - marginBottom}
							stroke="rgb(229, 231, 235)"
							stroke-width="1"
							stroke-dasharray="5 5"
						/>

						<circle
							cx={x(i)}
							cy={y(val)}
							r="4"
							fill={data[0].color}
							stroke="white"
							stroke-width="1.5"
						/>
					{/if}

					<!-- Rect over band with to trigger show index -->
					<rect
						x={x(i) - segmentWidth / 2}
						y={marginTop}
						width={segmentWidth}
						height={height - marginTop - marginBottom}
						fill="transparent"
						on:mouseover={() => (showIndex = i)}
						on:mouseout={() => (showIndex = null)}
						on:click={() => onChatClick(i)}
					/>
				{/each}
			</g></svg
		>

		{#each labels as label, i}
			{#if i % showEveryNthLabel == 0}
				<div
					class="text-xs text-gray-500 {showIndex == i
						? 'bg-gray-100'
						: ''} px-2 py-1 rounded-md -ml-7 w-14 text-center z-10"
					style="position: absolute; left: {x(i)}px; bottom: 0px"
				>
					{label}
				</div>
			{/if}
		{/each}

		{#if showIndex != null}
			{@const i = showIndex}
			{#key showIndex}
				<div
					class="absolute pointer-events-none"
					style="left: {x(i) + 13}px; top: {y(data[data.length - 1].values[i]) - 40}px"
				>
					<FloatingCard class="pointer-events-none">
						<slot name="tooltip" label={labels[i]} index={i} values={showValues} />
					</FloatingCard>
				</div>
			{/key}
		{/if}

		{#each y.ticks() as tick}
			{#if tick % 1 == 0}
				<div
					class="left-0 w-10 -mt-2 text-xs text-right text-gray-500"
					style="position: absolute; top: {y(tick)}px"
				>
					{tick.toLocaleString()}
				</div>
			{/if}
		{/each}
	</div>
</div>
