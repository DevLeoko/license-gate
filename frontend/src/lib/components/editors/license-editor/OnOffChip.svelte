<script lang="ts">
	import Chip from '../../basics/Chip.svelte'

	export let active = false

	let className = ''

	export { className as class }
</script>

<Chip snug class={className} color={active ? 'green-500' : 'gray-500'}
	>{active ? 'Enabled' : 'Off'}</Chip
>
