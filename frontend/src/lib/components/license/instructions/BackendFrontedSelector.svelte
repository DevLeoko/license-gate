<script lang="ts">
	import Chip from '../../basics/Chip.svelte'
	import OptionCard from './OptionCard.svelte'

	export let selected: 'frontend' | 'backend' | null

	function onSelected(value: 'frontend' | 'backend') {
		if (selected === value) {
			selected = null
		} else {
			selected = value
		}
	}
</script>

<div class="flex gap-4">
	<OptionCard
		title="Frontend"
		selected={selected === 'frontend'}
		on:click={() => onSelected('frontend')}
	>
		The license check is performed and the appropriate action is taken on the client side. <br />
		<span class="text-base translate-y-0.5 material-icons-outlined"> info </span>
		Recommended if you don't want to operate a backend infrastructure
		<Chip class="mt-2" color="gray-500">Less secure</Chip>
	</OptionCard>
	<OptionCard
		title="Backend"
		selected={selected === 'backend'}
		on:click={() => onSelected('backend')}
	>
		The license check is performed and the appropriate action is taken on the server side. <br />
		<span class="text-base translate-y-0.5 material-icons-outlined"> info </span>
		Recommended for enhanced security and control over application operations
		<Chip class="mt-2" color="green-500">Very secure</Chip>
	</OptionCard>
</div>
