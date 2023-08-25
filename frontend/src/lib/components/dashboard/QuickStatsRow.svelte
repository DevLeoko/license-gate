<script lang="ts">
	import Skeleton from '../basics/Skeleton.svelte'
	import QuickStatsBox from './QuickStatsBox.svelte'
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	{#if false}
		<Skeleton class="w-full h-16" />
	{:else}
		<QuickStatsBox icon="key" title="Active licenses" value="2" />

		<div class="bg-gray-300 w-[1px] self-stretch hidden xl:block">&nbsp;</div>

		<QuickStatsBox icon="check_circle" title="Successful checks (last 7 days)" value="43" />

		<div class="bg-gray-300 w-[1px] self-stretch hidden xl:block">&nbsp;</div>

		<QuickStatsBox icon="error_outline" title="Failed checks (last 7 days)" value="6" />

		<div class="bg-gray-300 w-[1px] self-stretch hidden xl:block">&nbsp;</div>

		<QuickStatsBox icon="access_time" title="Last check" value="12 min. ago" />
	{/if}
</div>
