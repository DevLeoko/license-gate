<script lang="ts">
	import Skeleton from '../basics/Skeleton.svelte'

	export let icon: string
	export let title: string
	export let value: string | number | undefined
	export let diffValue: number | undefined = undefined

	$: diffPct = diffValue ? Math.round(((value as number) / diffValue) * 100) - 100 : undefined
</script>

<div class="flex items-center w-60">
	<div class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-md">
		<span class="material-icons-outlined">
			{icon}
		</span>
	</div>
	<div class="flex flex-col gap-1 ml-2">
		<h3 class="text-sm font-semibold leading-none text-gray-500">{title}</h3>
		{#if value === undefined}
			<Skeleton class="w-8 h-4" />
		{:else}
			<div class="flex items-end gap-4">
				<p class="text-xl font-semibold leading-none text-gray-800">{value}</p>
				{#if diffPct}
					<span
						class:text-green-500={diffPct > 0}
						class:text-red-500={diffPct < 0}
						class="flex items-center gap-1 text-sm font-semibold leading-none"
					>
						<span class="text-sm material-icons">
							{diffPct > 0 ? 'arrow_upward' : 'arrow_downward'}
						</span>

						<span>
							{Math.abs(diffPct)}%
						</span>
					</span>
				{/if}
			</div>
		{/if}
	</div>
</div>
