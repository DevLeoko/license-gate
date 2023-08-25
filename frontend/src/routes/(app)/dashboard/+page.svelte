<script lang="ts">
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import QuickStatsRow from '../../../lib/components/dashboard/QuickStatsRow.svelte'
</script>

<PageTitle title="Dashboard" />

<div class="flex flex-col min-w-0">
	<QuickStatsRow />
	<hr class="my-4" />
	<!-- <RevenueChart /> -->
</div>
